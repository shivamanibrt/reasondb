//! Backup and recovery functionality for ReasonDB
//!
//! Provides:
//! - Full database snapshots
//! - Incremental backups
//! - Point-in-time recovery
//! - Export/import to JSON/CSV formats
//!
//! ## Example
//!
//! ```rust,no_run
//! use reasondb_core::backup::{BackupManager, BackupOptions, RestoreOptions};
//! use reasondb_core::NodeStore;
//!
//! # fn example() -> anyhow::Result<()> {
//! let store = NodeStore::open("./my_database")?;
//! let backup_manager = BackupManager::new(&store, "./backups")?;
//!
//! // Create a full backup
//! let backup = backup_manager.create_backup(&store, BackupOptions::full())?;
//! println!("Backup created: {}", backup.id);
//!
//! // Create an incremental backup
//! let incremental = backup_manager.create_backup(&store, BackupOptions::incremental())?;
//!
//! // List backups
//! let backups = backup_manager.list_backups()?;
//!
//! // Restore from backup
//! backup_manager.restore(&backup.id, "./restored_db", RestoreOptions::default())?;
//! # Ok(())
//! # }
//! ```

mod export;
mod manager;
mod snapshot;

pub use export::{
    ExportFormat, ExportOptions, ExportScope, Exporter, ImportOptions, ImportResult, Importer,
};
pub use manager::{BackupInfo, BackupManager, BackupOptions, BackupType, RestoreOptions};
pub use snapshot::{Snapshot, SnapshotMetadata};
