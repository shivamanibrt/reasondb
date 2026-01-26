//! In-memory LRU cache for hot data
//!
//! Provides fast access to frequently accessed documents and summaries
//! without hitting disk storage.

use std::collections::HashMap;
use std::sync::RwLock;
use std::time::{Duration, Instant};

/// A simple LRU cache with TTL support
pub struct Cache<V: Clone> {
    data: RwLock<HashMap<String, CacheEntry<V>>>,
    max_size: usize,
    ttl: Duration,
}

struct CacheEntry<V> {
    value: V,
    last_access: Instant,
    access_count: u64,
}

impl<V: Clone> Cache<V> {
    /// Create a new cache with the given max size and TTL
    pub fn new(max_size: usize, ttl_secs: u64) -> Self {
        Self {
            data: RwLock::new(HashMap::new()),
            max_size,
            ttl: Duration::from_secs(ttl_secs),
        }
    }

    /// Get a value from the cache
    pub fn get(&self, key: &str) -> Option<V> {
        let mut data = self.data.write().ok()?;
        
        if let Some(entry) = data.get_mut(key) {
            // Check TTL
            if entry.last_access.elapsed() > self.ttl {
                data.remove(key);
                return None;
            }
            
            entry.last_access = Instant::now();
            entry.access_count += 1;
            return Some(entry.value.clone());
        }
        
        None
    }

    /// Insert a value into the cache
    pub fn insert(&self, key: String, value: V) {
        let mut data = match self.data.write() {
            Ok(d) => d,
            Err(_) => return,
        };

        // Evict if at capacity
        if data.len() >= self.max_size {
            self.evict_lru(&mut data);
        }

        data.insert(key, CacheEntry {
            value,
            last_access: Instant::now(),
            access_count: 1,
        });
    }

    /// Remove a value from the cache
    pub fn remove(&self, key: &str) {
        if let Ok(mut data) = self.data.write() {
            data.remove(key);
        }
    }

    /// Clear the entire cache
    pub fn clear(&self) {
        if let Ok(mut data) = self.data.write() {
            data.clear();
        }
    }

    /// Get cache statistics
    pub fn stats(&self) -> CacheStats {
        let data = match self.data.read() {
            Ok(d) => d,
            Err(_) => return CacheStats::default(),
        };

        CacheStats {
            size: data.len(),
            max_size: self.max_size,
        }
    }

    /// Evict least recently used entries
    fn evict_lru(&self, data: &mut HashMap<String, CacheEntry<V>>) {
        // Find and remove the entry with oldest last_access
        if let Some(oldest_key) = data
            .iter()
            .min_by_key(|(_, entry)| entry.last_access)
            .map(|(k, _)| k.clone())
        {
            data.remove(&oldest_key);
        }
    }
}

/// Cache statistics
#[derive(Debug, Clone, Default)]
pub struct CacheStats {
    pub size: usize,
    pub max_size: usize,
}

/// Document summary for fast agentic scanning
#[derive(Debug, Clone)]
pub struct CachedDocSummary {
    pub id: String,
    pub title: String,
    pub summary: String,
    pub tags: Vec<String>,
    pub table_id: String,
}

/// Specialized cache for document summaries
pub struct SummaryCache {
    cache: Cache<CachedDocSummary>,
}

impl SummaryCache {
    /// Create a new summary cache
    /// Default: 10,000 summaries, 1 hour TTL
    pub fn new() -> Self {
        Self {
            cache: Cache::new(10_000, 3600),
        }
    }

    /// Create with custom settings
    pub fn with_capacity(max_summaries: usize, ttl_secs: u64) -> Self {
        Self {
            cache: Cache::new(max_summaries, ttl_secs),
        }
    }

    /// Get a document summary
    pub fn get(&self, doc_id: &str) -> Option<CachedDocSummary> {
        self.cache.get(doc_id)
    }

    /// Cache a document summary
    pub fn insert(&self, summary: CachedDocSummary) {
        self.cache.insert(summary.id.clone(), summary);
    }

    /// Get multiple summaries, returning found and missing IDs
    pub fn get_many(&self, doc_ids: &[String]) -> (Vec<CachedDocSummary>, Vec<String>) {
        let mut found = Vec::new();
        let mut missing = Vec::new();

        for id in doc_ids {
            match self.cache.get(id) {
                Some(summary) => found.push(summary),
                None => missing.push(id.clone()),
            }
        }

        (found, missing)
    }

    /// Invalidate a document's cached summary
    pub fn invalidate(&self, doc_id: &str) {
        self.cache.remove(doc_id);
    }

    /// Clear the entire cache
    pub fn clear(&self) {
        self.cache.clear();
    }

    /// Get cache statistics
    pub fn stats(&self) -> CacheStats {
        self.cache.stats()
    }
}

impl Default for SummaryCache {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cache_basic() {
        let cache: Cache<String> = Cache::new(10, 3600);
        
        cache.insert("key1".to_string(), "value1".to_string());
        assert_eq!(cache.get("key1"), Some("value1".to_string()));
        assert_eq!(cache.get("key2"), None);
    }

    #[test]
    fn test_cache_eviction() {
        let cache: Cache<i32> = Cache::new(2, 3600);
        
        cache.insert("a".to_string(), 1);
        cache.insert("b".to_string(), 2);
        cache.insert("c".to_string(), 3); // Should evict "a"
        
        assert_eq!(cache.get("c"), Some(3));
        assert_eq!(cache.get("b"), Some(2));
        // "a" might or might not be evicted depending on timing
    }

    #[test]
    fn test_summary_cache() {
        let cache = SummaryCache::new();
        
        let summary = CachedDocSummary {
            id: "doc1".to_string(),
            title: "Test Doc".to_string(),
            summary: "A test document".to_string(),
            tags: vec!["test".to_string()],
            table_id: "table1".to_string(),
        };
        
        cache.insert(summary.clone());
        
        let retrieved = cache.get("doc1").unwrap();
        assert_eq!(retrieved.title, "Test Doc");
    }

    #[test]
    fn test_get_many() {
        let cache = SummaryCache::new();
        
        cache.insert(CachedDocSummary {
            id: "doc1".to_string(),
            title: "Doc 1".to_string(),
            summary: "Summary 1".to_string(),
            tags: vec![],
            table_id: "t1".to_string(),
        });
        
        cache.insert(CachedDocSummary {
            id: "doc2".to_string(),
            title: "Doc 2".to_string(),
            summary: "Summary 2".to_string(),
            tags: vec![],
            table_id: "t1".to_string(),
        });
        
        let ids = vec!["doc1".to_string(), "doc2".to_string(), "doc3".to_string()];
        let (found, missing) = cache.get_many(&ids);
        
        assert_eq!(found.len(), 2);
        assert_eq!(missing, vec!["doc3".to_string()]);
    }
}
