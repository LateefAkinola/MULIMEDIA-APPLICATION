# MULIMEDIA APPLICATION
Tasked to add two more features that a user will greatly appreciate when using the multimedia app.

## **Description of the two features built and how they work**

The Multimedia Web App consists of the following features:

- **Upload Feature:**
   - The Upload Feature allows users to select and upload files from their local system.
   - When the user selects files using the file input field, the `handleFileUpload` function is triggered.
   - The function receives the selected files and extracts relevant information such as the file name, type, and path.
   - The file information is stored in the `uploadedFiles` array, which is then appended to the existing `myFiles` state.
   - The app uses unique identifiers to assign an `id` to each uploaded file.
   - Upon successful file upload, the `setShowUploadSuccessModal(true)` function is called to display an upload success modal to the user.

- **Search Feature:**
   - The Search Feature allows users to search for files based on keywords and file types.
   - The search keyword and file type filter are stored in the `searchKeyword` and `searchFileType` states, respectively.
   - Whenever any of these states change, the `useEffect` hook is triggered.
   - Inside the hook, the app creates a new array called `allFiles` by combining the `myFiles` and `uploadedFiles` arrays.
   - The `allFiles` array is then filtered based on the search conditions:
     - If the file's name or type includes the search keyword (case-insensitive comparison), it is considered a match.
     - If the selected file type is "all," all files are included in the filtered array.
     - If a specific file type is selected, only files that match the keyword and have the selected file type are included.
   - The filtered array is stored in the `filteredFiles` state and rendered in the search modal for display to the user.

## **Reasons for Choosing these Features**

These two features were chosen for the Multimedia Web App due to their practicality and usefulness in managing and organizing multimedia files.

- **Upload Feature:**
   - Uploading files is a fundamental requirement for any multimedia application.
   - By allowing users to upload files, the app enables them to add their own content to the system.
   - This feature enhances user engagement and personalization, making the app more versatile and customizable.

- **Search Feature:**
   - As the number of uploaded files increases, finding specific files becomes challenging.
   - The search feature simplifies file discovery by allowing users to search based on keywords and file types.
   - Users can quickly locate desired files without manually scrolling through a long list, improving the overall user experience.

## **Explanation of How the Code Works**

- **Upload Feature:**
   - The `handleFileUpload` function is triggered when the user selects files using the file input field.
   - It receives the `event` object containing the selected files.
   - It creates an empty array called `uploadedFiles` to store the file information.
   - It iterates over each selected file using a `for` loop.
   - Inside the loop, it creates a new object `newFile` containing the file information such as `id`, `name`, `type`, `path`, and `uploaded`.
      - `id`: A unique identifier generated by combining the current timestamp with the loop index.
      - `name`: The name of the file extracted from the `file.name` property.
      - `type`: The type of the file determined by the `getFileType` function based on the file's MIME type.
      - `path`: A URL created using the `URL.createObjectURL` method, which generates a temporary URL for the file.
      - `uploaded`: This is set to `true` for uploaded files.
   - The `newFile` object is then added to the `uploadedFiles` array.
   - After the loop, the file list is updated by appending the `uploadedFiles` array to the existing `myFiles` array using the spread operator (`...`).
   - The `uploadedFiles` state is also updated by appending the `uploadedFiles` array to the existing `uploadedFiles` state.
      - This step is necessary to keep track of uploaded files separately from the initial `myFiles` state.
   - The `setShowUploadSuccessModal` function is called to set the `showUploadSuccessModal` state to `true`, triggering the display of the upload success modal.
   - The upload success modal is implemented as a separate component, which can be rendered conditionally based on the `showUploadSuccessModal` state.
      - When the `showUploadSuccessModal` state is `true`, the modal component is rendered, displaying the "Upload Successful" message.
      - The modal component can be closed by clicking on a close button or using any other desired method.
   - Finally, the `uploadingFile` state is set to `false`, indicating that the uploading process is complete.


- **Search Feature:**
   - The search feature is divided into two parts: keyword-based search and file type filter.
   - The search keyword and file type filter are stored in the `searchKeyword` and `searchFileType` states, respectively.
   - Whenever the `searchKeyword`, `searchFileType`, `myFiles`, or `uploadedFiles` state changes, the `useEffect` hook is triggered.
   - Inside the `useEffect` hook, a new array `allFiles` is created by combining the `myFiles` and `uploadedFiles` arrays.
   - The `allFiles` array is filtered based on the following conditions:
      - The `matchesKeyword` variable is set to `true` if the file's name or type includes the search keyword (case-insensitive comparison).
      - If the selected file type is "all," the file is included in the filtered array.
      - If the selected file type is specific (e.g., "audio," "video," etc.), the file is included only if it matches the keyword and has the selected file type.
   - The filtered array is then stored in the `filteredFiles` state.
   - The `filteredFiles` array is rendered in the search modal, displaying the matching files.
   - The search input field allows the user to enter a search keyword.
   - The file type filter is implemented using a select dropdown, allowing users to choose from different file types.
   - Whenever the user changes the search keyword or file type filter, the corresponding states (`searchKeyword` or `searchFileType`) are updated accordingly.
   - The `filteredFiles` array is then updated based on the new search conditions, triggering a re-render of the search modal with the updated file list.

`NOTE:` The Rename and Delete buttons were updated so that they could be able to work for the `uploaded` files.
   - The `handleFileRename` function is responsible for renaming a selected file. Here's a breakdown of how it works:
      - It first checks if there is a `selectedFile` available. If not, the function does nothing.
      
      - Depending on whether the `selectedFile` is uploaded or not (`selectedFile.uploaded`), it assigns the appropriate file array to the `updatedFiles` variable. If the file is uploaded, it assigns the `uploadedFiles` array; otherwise, it assigns the `myFiles` array.
      
      - It then maps over the `updatedFiles` array and creates a new array, `newFiles`. For the selected file, it checks if its `id` matches the `selectedFile.id`. If there is a match, it creates a new object with the updated `name` using the spread operator (`{ ...file, name: newName }`), while keeping the other properties of the file unchanged. For all other files, it simply returns the original file object.
      
      - After updating the `newFiles` array, it sets the state variables accordingly. If the selected file is uploaded (`selectedFile.uploaded` is `true`), it calls `setUploadedFiles(newFiles)` to update the `uploadedFiles` state. Otherwise, it calls `setMyFiles(newFiles)` to update the `myFiles` state.
   

**`That's a detailed explanation of the upload and search features added to the multimedia app.`**
