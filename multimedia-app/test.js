{showSearchModal && (
    <div style={styles.modal}>
     <div style={styles.modalContent}>
      <div style={styles.modalHeader}>
       <p style={{ fontWeight: "bold" }}>Search Result</p>
       <button style={styles.closeButton} onClick={() => setShowSearchModal(false)}>close</button>
      </div>
      <div style={styles.modalBody}>
        {/* Display filtered files */}
        <div style={{ width: "100%", padding: 10 }}>
        {filteredFiles.map((file) => {
            if (file.path.slice(0, filePath.length) === filePath) {
            return (
                <div
                style={styles.file}
                className="files"
                key={file.id}
                onClick={() => {
                    if (selectedFile && selectedFile.id === file.id) {
                    setSelectedFile(null);
                    return;
                    }
                    setSelectedFile(file);
                }}
                >
                <p>{file.name}</p>
                </div>
            );
            }
        })}
        </div>
      </div>
     </div>
    </div>
   )}

   