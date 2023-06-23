import React, { useState, useEffect, useRef } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 ArcElement,
 Tooltip,
 Legend
} from 'chart.js';
ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend,
 ArcElement
);

export default function App() {
 const [myFiles, setMyFiles] = useState([])
 const [selectedFile, setSelectedFile] = useState(null)
 const [filePath, setFilePath] = useState("/file-server/")
 const [showChartModal, setShowChartModal] = useState(false)
 const [uploadingFile, setUploadingFile] = useState(false);
 const [uploadedFiles, setUploadedFiles] = useState([]);
 const [searchKeyword, setSearchKeyword] = useState("");
 const [searchFileType, setSearchFileType] = useState("all");
 const [filteredFiles, setFilteredFiles] = useState([]);
 const [showSearchModal, setShowSearchModal] = useState(false)
 const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false)
 const fileInputRef = useRef(null);
 
 useEffect(() => {
  setMyFiles(data)
 }, [])

 useEffect(() => {
  const allFiles = [...myFiles, ...uploadedFiles];

  const filtered = allFiles.filter((file) => {
    const matchesKeyword =
      file.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      file.type.toLowerCase().includes(searchKeyword.toLowerCase());

    if (searchFileType === "all") {
      return matchesKeyword;
    } else {
      return matchesKeyword && file.type === searchFileType;
    }
  });

  setFilteredFiles(filtered);
 }, [searchKeyword, searchFileType, myFiles, uploadedFiles]);



 var barChartOptions = {
  responsive: true,
  plugins: {
   legend: {
    position: 'top',
   },
   title: {
    display: true,
    text: 'Files Breakdown',
   },
  },
 };

 // Handles file upload
 const handleFileUpload = (event) => {
    const files = event.target.files;
    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newFile = {
        id: Date.now() + i,
        name: file.name,
        type: getFileType(file.type),
        path: URL.createObjectURL(file),
        uploaded: true
      };
      uploadedFiles.push(newFile);
    }

  setUploadedFiles((prevFiles) => [...prevFiles, ...uploadedFiles]); // Update uploadedFiles state
  setMyFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  setUploadingFile(false);
  setShowUploadSuccessModal(true); // Show successful upload modal
  };

   // Handles file Rename
  const handleFileRename = (newName) => {
    if (selectedFile) {
      const updatedFiles = selectedFile.uploaded ? uploadedFiles : myFiles;
      const newFiles = updatedFiles.map((file) => {
        if (file.id === selectedFile.id) {
          return { ...file, name: newName };
        }
        return file;
      });
  
      if (selectedFile.uploaded) {
        setUploadedFiles(newFiles);
      } else {
        setMyFiles(newFiles);
      }
    }
  };
  
 // Get file type based on MIME type
  const getFileType = (fileType) => {
    if (fileType.startsWith("audio")) {
      return "audio";
    } else if (fileType.startsWith("video")) {
      return "video";
    } else if (fileType.startsWith("image")) {
      return "image";
    } else {
      return "document";
    }
  };

 return (
  <>
  {showChartModal && (
      <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
        <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
        <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>&times; close</button>
        </div>
        <div style={styles.modalBody}>
        <Pie
          data={{
          labels: ['Video', 'Audio', 'Document', 'Image'],
          datasets: [
            {
            label: 'Files Breakdown',
            data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
            },
          ],
          }}
        />
        <Bar
          data={{
          labels: ['Video', 'Audio', 'Document', 'Image'],
          datasets: [
            {
            label: 'Files Breakdown',
            data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
            },
          ],
          }}
          options={barChartOptions}
        />
        </div>
      </div>
      </div>
  )}

  {/*------------------------------------------ Search Modal --------------------------------------------------------*/}
  {showSearchModal && (
    <div style={styles.modal}>
     <div style={styles.modalContent}>
       <div style={styles.modalHeader}>
        <p style={{ fontWeight: "bold" }}>Search Files</p> 
        <button style={styles.closeButton} onClick={() => setShowSearchModal(false)}>&times; close</button>
       </div>

        {/*--------------File Search-------------------*/}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Search input */}
                <input
                  type="text"
                  placeholder="Search by name or type"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                {/* File type filter */}
                <select
                  value={searchFileType}
                  onChange={(e) => setSearchFileType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                </select>
        </div>
        
        {/*------------------------Display filtered files------------------------ */}
        <div style={styles.modalSearchList}>
          <div style={{ width: "100%", padding: 10 }}>
            {/* Iterate over unique file IDs */}
            {Array.from(new Set(filteredFiles.map(file => file.id))).map(fileId => {
              const file = filteredFiles.find(file => file.id === fileId);
              if (file) {
                return (
                  // Individual file
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
              return null;
            })}
          </div>
        </div>
     </div>
    </div>
    )}

  {/*--------------------------------------------- Upload Success Modal -----------------------------------------*/}
  {showUploadSuccessModal && (
    <div style={styles.modal}>
     <div style={styles.modalUploadSuccess}>
      <div style={styles.modalHeader}>
        <p style={{ fontWeight: "bold" }}>Upload Successful ✅</p> 
       <button style={styles.closeButton} onClick={() => setShowUploadSuccessModal(false)}>&times; close</button>
      </div>
      <p>Your file(s) have been uploaded successfully!</p>
     </div>
    </div>
  )}

  {/*----------------File Upload--------------*/}
  <input
      type="file"
      accept="audio/*,video/*,image/*,application/pdf"
      multiple
      onChange={handleFileUpload}
      style={{ display: "none" }}
      ref={fileInputRef}
    />

   {/* ----------------------------------------------------------------   */}
   <div className="App">
    <Header />
    <div style={styles.container}>
     <div style={{ padding: 10, paddingBottom: 0, }}>
      <p style={{ fontWeight: "bold" }}>My Files</p>
      <p>{selectedFile ? selectedFile.path : filePath}</p>
     </div>
     <div style={styles.controlTools}>
            <button
                style={styles.controlButton}
                onClick={() => {
                  fileInputRef.current.click();
                  setUploadingFile(true);
                }}
              >
                {/*----To display 'uploading...' when clicked------*/}
                {uploadingFile ? "🔄 Uploading..." : "⬆ Upload Files"}
              </button>
              <button
                style={styles.controlButton}
                onClick={() => {
                  if (selectedFile) {
                    const newName = prompt("Enter new name", selectedFile.name);
                    if (newName) {
                      handleFileRename(newName);
                    }
                    setSelectedFile(null);
                  }
                }}
              >Rename</button>
            <button style={styles.controlButton}
              onClick={() => {
                setShowChartModal(true)
              }}
            >Files Breakdown</button>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile){
                  window.open(selectedFile.path, "_blank")
                }
              }}
            >Download</button>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.filter(file => file.id !== selectedFile.id);
                  setMyFiles(newFiles);

                  // To be able to delete uploaded files 
                  setUploadedFiles((prevFiles) =>
                  prevFiles.filter((file) => file.id !== selectedFile.id)
                );
                  setSelectedFile(null);
                }
              }}
            >Delete</button>

            {/* Search Button */}
            <button style={styles.controlButton}
              onClick={() => {
                setShowSearchModal(true)
              }}
            >🔍Search Files</button>
          </div>

     <div style={styles.fileContainer}>
      <div style={{ width: "100%", padding: 10 }}>
       {myFiles.map((file) => {
 
        if (file.path.slice(0, filePath.length) === filePath) {
         return (
          <div style={styles.file} className="files" key={file.id} onClick={() => {
           if (selectedFile && selectedFile.id === file.id) {
            setSelectedFile(null)
            return
           }
           setSelectedFile(file)
          }}>
           <p>{file.name}</p>
          </div>
         )
        }
       })}

       {/* To display existing files and the uploaded files in the file list. */}
       {uploadedFiles.map((file) => (
        <div style={styles.file} className="files" key={file.id} onClick={() => {
          if (selectedFile && selectedFile.id === file.id) {
            setSelectedFile(null);
            return;
          }
          setSelectedFile(file);
        }}>
          <p>{file.name}</p>
        </div>
      ))}

      </div>
      {selectedFile && (
       <div style={styles.fileViewer}>
        {selectedFile.type === 'video' && (
         <VideoPlayer path={selectedFile.path} />
        )}
        {selectedFile.type === 'audio' && (
         <AudioPlayer path={selectedFile.path} />
        )}
        {selectedFile.type === 'document' && (
         <DocumentViewer path={selectedFile.path} />
        )}
        {selectedFile.type === 'image' && (
         <ImageViewer path={selectedFile.path} />
        )}
        <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
        <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span></p>
        <p>file type: <span style={{fontStyle: "italic"}}>{selectedFile.type}</span></p>
       </div>
 
      )}
     </div>
    </div>
   </div>
  </>
 );
}
 
const styles = {
 container: {
  backgroundColor: '#fff',
  color: '#000',
 },
 fileContainer: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexDirection: 'row',
 
 },
 file: {
  backgroundColor: '#eee',
  padding: '10px',
  marginBottom: '10px',
  cursor: 'pointer',
  width: '100%',
 },
 fileViewer: {
  padding: '10px',
  margin: '10px',
  width: '40vw',
  height: '100vh',
  cursor: 'pointer',
  borderLeft: '1px solid #000'
 },
 controlTools: {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '10px',
 },
 controlButton: {
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
 },
// modal
modal: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: '#fff',
  padding: '20px',
  height: '50vh',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
},
modalClose: {
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '10px',
  cursor: 'pointer',
},
modalBody:{
  width: '100%',
  height: '90%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '10px',
},

// Added to make the restrict the filtered files from overflowing
modalSearchList:{
  width: '100%',
  height: '90%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '10px',
  overflowY: 'auto', // Enable vertical scrolling
},

modalUploadSuccess: {
  backgroundColor: '#fff',
  padding: '20px',
  height: '20vh',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
},

modalHeader: {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
},
closeButton: {
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  backgroundColor: '#eee',
}
};