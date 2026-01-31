import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';
import { useToast } from '../../components/Toast';
import { 
  GraduationCap, 
  Users, 
  Theater, 
  CheckCircle2, 
  ClipboardList,
  FileText,
  Upload,
  Image,
  Loader2,
  UserPlus,
  Trash2,
  Calendar,
  MapPin,
  User,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

const FacultyHome = () => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
    
    .faculty-home {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
      padding: 32px;
    }
    
    .welcome-section {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      border-radius: 24px;
      padding: 48px;
      color: white;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }
    
    .welcome-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 60%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    
    .welcome-content {
      display: flex;
      align-items: center;
      gap: 24px;
      position: relative;
      z-index: 1;
    }
    
    .welcome-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .welcome-text h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 8px 0;
    }
    
    .welcome-text p {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .stat-card {
      background: white;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(30, 64, 175, 0.08);
      display: flex;
      align-items: flex-start;
      gap: 20px;
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(30, 64, 175, 0.12);
    }
    
    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .stat-icon.blue {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    }
    
    .stat-icon.sky {
      background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
    }
    
    .stat-icon.indigo {
      background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
    }
    
    .stat-content h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .stat-content p {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="faculty-home">
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-icon">
              <GraduationCap size={40} color="white" />
            </div>
            <div className="welcome-text">
              <h1>Faculty Dashboard</h1>
              <p>Manage clubs, assign coordinators, and verify events</p>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Theater size={28} color="white" />
            </div>
            <div className="stat-content">
              <h3>Create Clubs</h3>
              <p>Establish new clubs with descriptions and branding images for the campus community.</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon sky">
              <Users size={28} color="white" />
            </div>
            <div className="stat-content">
              <h3>Manage Coordinators</h3>
              <p>Assign and manage student coordinators for each club you oversee.</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon indigo">
              <CheckCircle2 size={28} color="white" />
            </div>
            <div className="stat-content">
              <h3>Verify Events</h3>
              <p>Review and approve or reject events submitted by coordinators.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CreateClub = () => {
  const [clubData, setClubData] = useState({ name: '', description: '' });
  const [clubImage, setClubImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setClubData({ ...clubData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClubImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setClubImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubData.name || !clubData.description) {
      showError('Please fill in all fields');
      return;
    }

    try {
      setUploading(true);
      let imageUrl = '';

      if (clubImage) {
        const formData = new FormData();
        formData.append('file', clubImage);
        const uploadRes = await api.post('/upload/upload', formData);
        imageUrl = uploadRes.data.url;
      }

      await api.post('/faculty/create-club', {
        name: clubData.name,
        description: clubData.description,
        image: imageUrl
      });

      showSuccess('Club created successfully!');
      setClubData({ name: '', description: '' });
      setClubImage(null);
      setImagePreview(null);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create club');
    } finally {
      setUploading(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
    
    .create-club {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
      padding: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .create-club-content {
      width: 100%;
      max-width: 700px;
    }
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .header-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .page-header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }
    
    .form-card {
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(30, 64, 175, 0.08);
      width: 100%;
    }
    
    .form-group {
      margin-bottom: 24px;
    }
    
    .form-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
      font-size: 0.95rem;
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #0ea5e9;
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
    }
    
    .form-group textarea {
      min-height: 120px;
      resize: vertical;
    }
    
    .upload-zone {
      border: 2px dashed #cbd5e1;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8fafc;
    }
    
    .upload-zone:hover,
    .upload-zone.drag-active {
      border-color: #0ea5e9;
      background: rgba(14, 165, 233, 0.05);
    }
    
    .upload-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    
    .upload-zone h4 {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .upload-zone p {
      font-family: 'DM Sans', sans-serif;
      color: #64748b;
      margin: 0;
      font-size: 0.9rem;
    }
    
    .image-preview {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      max-width: 300px;
    }
    
    .image-preview img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }
    
    .image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 16px;
    }
    
    .change-btn {
      background: rgba(255, 255, 255, 0.9);
      color: #1e40af;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.85rem;
    }
    
    .submit-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
    }
    
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .spin {
      animation: spin 1s linear infinite;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="create-club">
        <div className="create-club-content">
          <div className="page-header">
            <div className="header-icon">
              <Theater size={28} color="white" />
            </div>
            <h1>Create New Club</h1>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <FileText size={18} color="#1e40af" />
                  Club Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={clubData.name}
                  onChange={handleChange}
                  placeholder="Enter club name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <ClipboardList size={18} color="#1e40af" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={clubData.description}
                  onChange={handleChange}
                  placeholder="Describe the club's purpose and activities"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Image size={18} color="#1e40af" />
                  Club Image
                </label>
                <input
                  type="file"
                  id="clubImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {!imagePreview ? (
                  <div
                    className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                    onClick={() => document.getElementById('clubImage').click()}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="upload-icon">
                      <Upload size={28} color="white" />
                    </div>
                    <h4>Drop image here or click to upload</h4>
                    <p>PNG, JPG up to 5MB</p>
                  </div>
                ) : (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <div className="image-overlay">
                      <button
                        type="button"
                        className="change-btn"
                        onClick={() => document.getElementById('clubImage').click()}
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 size={20} className="spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Theater size={20} />
                    Create Club
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  const fetchClubs = useCallback(async () => {
    try {
      const res = await api.get('/faculty/clubs');
      setClubs(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get('/faculty/students');
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
    fetchStudents();
  }, [fetchClubs, fetchStudents]);

  const handleAssignCoordinator = async () => {
    if (!selectedClub || !selectedStudent) {
      showError('Please select both a club and a student');
      return;
    }

    try {
      await api.post('/faculty/assign-coordinator', {
        clubId: selectedClub,
        studentId: selectedStudent
      });
      showSuccess('Coordinator assigned successfully!');
      setSelectedClub('');
      setSelectedStudent('');
      fetchClubs();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to assign coordinator');
    }
  };

  const handleRemoveCoordinator = async (clubId, coordinatorId, coordinatorName) => {
    const confirmRemove = window.confirm(
      `Are you sure you want to remove "${coordinatorName}" as coordinator?`
    );
    if (!confirmRemove) return;

    try {
      await api.post('/faculty/remove-coordinator', {
        clubId,
        coordinatorId
      });
      showSuccess('Coordinator removed successfully!');
      fetchClubs();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to remove coordinator');
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
    
    .manage-clubs {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
      padding: 32px;
    }
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .header-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .page-header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }
    
    .section-card {
      background: white;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(30, 64, 175, 0.08);
      margin-bottom: 32px;
    }
    
    .section-card h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 24px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #1e293b;
      font-size: 0.95rem;
    }
    
    .form-group select {
      padding: 14px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .form-group select:focus {
      outline: none;
      border-color: #0ea5e9;
      box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
    }
    
    .assign-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .assign-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
    }
    
    .empty-state {
      text-align: center;
      padding: 48px;
    }
    
    .empty-icon {
      width: 96px;
      height: 96px;
      background: linear-gradient(135deg, #e0e7ff 0%, #bae6fd 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    
    .empty-state h3 {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #64748b;
      margin: 0;
    }
    
    .clubs-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .clubs-table th {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      padding: 16px;
      text-align: left;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .clubs-table th:first-child {
      border-radius: 12px 0 0 12px;
    }
    
    .clubs-table th:last-child {
      border-radius: 0 12px 12px 0;
    }
    
    .clubs-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      color: #334155;
      vertical-align: top;
    }
    
    .clubs-table tr:hover td {
      background: #f8fafc;
    }
    
    .club-name {
      font-weight: 600;
      color: #1e293b;
    }
    
    .coordinator-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .coordinator-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-radius: 12px;
      border: 1px solid #86efac;
    }
    
    .coordinator-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    
    .coordinator-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .coordinator-details {
      display: flex;
      flex-direction: column;
    }
    
    .coordinator-name {
      font-weight: 600;
      color: #166534;
      font-size: 0.95rem;
    }
    
    .coordinator-email {
      font-size: 0.85rem;
      color: #64748b;
    }
    
    .remove-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;
    }
    
    .remove-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }
    
    .no-coordinator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #fef3c7;
      color: #92400e;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .coordinator-count {
      font-size: 0.9rem;
      color: #64748b;
    }
    
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      gap: 16px;
    }
    
    .loading-icon {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .spin {
      animation: spin 1s linear infinite;
    }
    
    .loading-state p {
      font-family: 'DM Sans', sans-serif;
      color: #64748b;
      font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="manage-clubs">
          <div className="section-card">
            <div className="loading-state">
              <div className="loading-icon">
                <Loader2 size={32} color="white" className="spin" />
              </div>
              <p>Loading clubs...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="manage-clubs">
        <div className="page-header">
          <div className="header-icon">
            <Theater size={28} color="white" />
          </div>
          <h1>Manage Clubs</h1>
        </div>

        <div className="section-card">
          <h2>
            <UserPlus size={24} color="#1e40af" />
            Assign Coordinator
          </h2>
          <div className="form-row">
            <div className="form-group">
              <label>Select Club</label>
              <select value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}>
                <option value="">-- Select Club --</option>
                {clubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Student</label>
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="assign-btn" onClick={handleAssignCoordinator}>
            <UserPlus size={20} />
            Assign Coordinator
          </button>
        </div>

        <div className="section-card">
          <h2>
            <Theater size={24} color="#1e40af" />
            My Clubs
          </h2>
          {clubs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Theater size={40} color="#1e40af" />
              </div>
              <h3>No clubs created yet.</h3>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="clubs-table">
                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Description</th>
                    <th>Coordinators</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {clubs.map((club) => (
                    <tr key={club._id}>
                      <td className="club-name">{club.name}</td>
                      <td>{club.description}</td>
                      <td>
                        {club.coordinators && club.coordinators.length > 0 ? (
                          <div className="coordinator-list">
                            {club.coordinators.map((coordinator) => (
                              <div key={coordinator._id} className="coordinator-item">
                                <div className="coordinator-info">
                                  <div className="coordinator-avatar">
                                    <User size={18} color="white" />
                                  </div>
                                  <div className="coordinator-details">
                                    <span className="coordinator-name">{coordinator.name}</span>
                                    <span className="coordinator-email">{coordinator.email}</span>
                                  </div>
                                </div>
                                <button
                                  className="remove-btn"
                                  onClick={() => handleRemoveCoordinator(club._id, coordinator._id, coordinator.name)}
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="no-coordinator">
                            <AlertCircle size={16} />
                            No coordinators assigned
                          </span>
                        )}
                      </td>
                      <td className="coordinator-count">
                        {club.coordinators?.length || 0} coordinator(s)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const VerifyEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [pending, approved] = await Promise.all([
        api.get('/faculty/events/pending'),
        api.get('/faculty/events/approved')
      ]);
      setPendingEvents(pending.data);
      setApprovedEvents(approved.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await api.put(`/faculty/verify-event/${eventId}`, { status: 'approved' });
      showSuccess('Event approved successfully!');
      fetchEvents();
    } catch (error) {
      showError('Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      await api.put(`/faculty/verify-event/${eventId}`, { status: 'rejected' });
      showSuccess('Event rejected');
      fetchEvents();
    } catch (error) {
      showError('Failed to reject event');
    }
  };

  const handleDelete = async (eventId, eventName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the event "${eventName}"?\n\nThis action cannot be undone and will remove all associated data including:\n- Event details\n- Registered participants\n- Reviews and feedback`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/faculty/event/${eventId}`);
      showSuccess('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
    
    .verify-events {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 50%, #f0fdf4 100%);
      padding: 32px;
    }
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .header-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .page-header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }
    
    .section-card {
      background: white;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(30, 64, 175, 0.08);
      margin-bottom: 32px;
    }
    
    .section-card h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 24px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .section-card h2.approved {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .empty-state {
      text-align: center;
      padding: 48px;
    }
    
    .empty-icon {
      width: 96px;
      height: 96px;
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    
    .empty-state h3 {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #64748b;
      margin: 0;
    }
    
    .events-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .events-table th {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      padding: 16px;
      text-align: left;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .events-table th:first-child {
      border-radius: 12px 0 0 12px;
    }
    
    .events-table th:last-child {
      border-radius: 0 12px 12px 0;
    }
    
    .events-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      color: #334155;
    }
    
    .events-table tr:hover td {
      background: #f8fafc;
    }
    
    .event-name {
      font-weight: 600;
      color: #1e293b;
    }
    
    .event-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    
    .approve-btn {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;
    }
    
    .approve-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    }
    
    .reject-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;
    }
    
    .reject-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }
    
    .report-btn {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;
    }
    
    .report-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
    }
    
    .delete-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;
    }
    
    .delete-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      color: #166534;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      gap: 16px;
    }
    
    .loading-icon {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .spin {
      animation: spin 1s linear infinite;
    }
    
    .loading-state p {
      font-family: 'DM Sans', sans-serif;
      color: #64748b;
      font-size: 1.1rem;
    }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="verify-events">
          <div className="section-card">
            <div className="loading-state">
              <div className="loading-icon">
                <Loader2 size={32} color="white" className="spin" />
              </div>
              <p>Loading events...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="verify-events">
        <div className="page-header">
          <div className="header-icon">
            <CheckCircle2 size={28} color="white" />
          </div>
          <h1>Verify Events</h1>
        </div>

        <div className="section-card">
          <h2>
            <ClipboardList size={24} color="#1e40af" />
            Pending Events
          </h2>
          {pendingEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <CheckCircle2 size={40} color="#22c55e" />
              </div>
              <h3>No pending events to review.</h3>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEvents.map((event) => (
                    <tr key={event._id}>
                      <td className="event-name">{event.name}</td>
                      <td>
                        <span className="event-meta">
                          <Calendar size={16} />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className="event-meta">
                          <MapPin size={16} />
                          {event.venue}
                        </span>
                      </td>
                      <td>
                        <span className="event-meta">
                          <User size={16} />
                          {event.createdBy?.name}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="approve-btn" onClick={() => handleApprove(event._id)}>
                            <Check size={16} />
                            Approve
                          </button>
                          <button className="reject-btn" onClick={() => handleReject(event._id)}>
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="section-card">
          <h2 className="approved">
            <CheckCircle2 size={24} />
            Approved Events
          </h2>
          {approvedEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ClipboardList size={40} color="#1e40af" />
              </div>
              <h3>No approved events yet.</h3>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Status</th>
                    <th>Report</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedEvents.map((event) => (
                    <tr key={event._id}>
                      <td className="event-name">{event.name}</td>
                      <td>
                        <span className="event-meta">
                          <Calendar size={16} />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className="event-meta">
                          <MapPin size={16} />
                          {event.venue}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge">
                          <Check size={14} />
                          Approved
                        </span>
                      </td>
                      <td>
                        <button
                          className="report-btn"
                          onClick={async () => {
                            try {
                              showSuccess('Generating report...');
                              const response = await api.get(`/faculty/event/${event._id}/report`, {
                                responseType: 'blob'
                              });

                              const url = window.URL.createObjectURL(new Blob([response.data]));
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', `${event.name.replace(/[^a-z0-9]/gi, '_')}_Attendance_Report.xlsx`);
                              document.body.appendChild(link);
                              link.click();
                              link.remove();
                              window.URL.revokeObjectURL(url);

                              showSuccess('Report downloaded successfully!');
                            } catch (error) {
                              console.error('Download error:', error);
                              showError('Failed to download report');
                            }
                          }}
                        >
                          <FileSpreadsheet size={16} />
                          View Report
                        </button>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(event._id, event.name)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const FacultyDashboard = () => {
  const navItems = [
    { label: 'Home', path: '/faculty' },
    { label: 'Create Club', path: '/faculty/create-club' },
    { label: 'Manage Clubs', path: '/faculty/clubs' },
    { label: 'Events Details', path: '/faculty/events' }
  ];

  return (
    <>
      <Navbar role="faculty" navItems={navItems} />
      <Routes>
        <Route path="/" element={<FacultyHome />} />
        <Route path="/create-club" element={<CreateClub />} />
        <Route path="/clubs" element={<ManageClubs />} />
        <Route path="/events" element={<VerifyEvents />} />
      </Routes>
    </>
  );
};

export default FacultyDashboard;
