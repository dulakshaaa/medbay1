import { uploadPdf } from '../services/api';

const PdfUploader = ({ onUpload }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        await uploadPdf(file);
        onUpload(file.name);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <div className="pdf-uploader">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
  );
};

export default PdfUploader;