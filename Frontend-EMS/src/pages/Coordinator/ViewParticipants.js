import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';
import * as XLSX from 'xlsx';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Loader2, 
  FileSpreadsheet, 
  MailX, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Star,
  User,
  Mail,
  Building2,
  Phone
} from 'lucide-react';

const ViewParticipants = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState({});
  const { showSuccess, showError } = useToast();

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/coordinator/events');
      const approvedEvents = response.data.filter(event => event.status === 'approved');
      setEvents(approvedEvents);
      setLoading(false);
    } catch (error) {
      showError('Failed to fetch events');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const response = await api.get(`/coordinator/event/${eventId}/participants`);
      setParticipants(response.data.participants || []);
      setEventDetails(response.data.event);
      setAttendance(response.data.attendance || []);
      setFeedbacks(response.data.feedbacks || []);
      setSelectedEvent(eventId);
      setLoadingParticipants(false);
    } catch (error) {
      let errorMessage = 'Failed to fetch participants';
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if backend is running.';
      }
      showError(errorMessage);
      setLoadingParticipants(false);
      setSelectedEvent(null);
    }
  };

  const markAttendance = async (studentId, status) => {
    setMarkingAttendance(prev => ({ ...prev, [studentId]: true }));
    try {
      const response = await api.post(`/coordinator/event/${selectedEvent}/attendance`, {
        studentId,
        status
      });
      setAttendance(response.data.attendance || []);
      showSuccess(`Attendance marked as ${status}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      showError(errorMessage);
    } finally {
      setMarkingAttendance(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(att => att.student === studentId);
    return record ? record.status : null;
  };

  const getFeedback = (studentId) => {
    return feedbacks.find(fb => fb.student._id === studentId);
  };

  const isEventStarted = () => {
    if (!eventDetails) return false;
    const eventDate = new Date(eventDetails.date);
    const [hours, minutes] = eventDetails.time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0);
    return new Date() >= eventDate;
  };

  const exportToExcel = () => {
    if (!participants || participants.length === 0) {
      showError('No participants to export');
      return;
    }

    try {
      const excelData = participants.map((participant, index) => {
        const attendanceRecord = attendance.find(att => att.student === participant._id);
        const attendanceStatus = attendanceRecord ?
          (attendanceRecord.status === 'present' ? 'Present' : 'Absent') :
          'Not Marked';

        const feedbackRecord = feedbacks.find(fb => fb.student._id === participant._id);
        const feedbackRating = feedbackRecord ? `${feedbackRecord.rating}/5 stars` : 'Not Submitted';
        const feedbackComment = feedbackRecord ? feedbackRecord.comment : 'N/A';

        return {
          'S.No': index + 1,
          'Student ID': participant.studentId || 'N/A',
          'Name': participant.name,
          'Email': participant.email,
          'Department': participant.department || 'N/A',
          'Contact No': participant.contactNo || 'N/A',
          'Feedback Rating': feedbackRating,
          'Feedback Comment': feedbackComment,
          'Attendance': attendanceStatus
        };
      });

      const eventInfo = [
        { 'S.No': 'Event Details', 'Student ID': '', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Event Name', 'Student ID': eventDetails.name, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Date', 'Student ID': new Date(eventDetails.date).toLocaleDateString(), 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Time', 'Student ID': eventDetails.time, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Venue', 'Student ID': eventDetails.venue, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Club', 'Student ID': eventDetails.club?.name || 'N/A', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Total Participants', 'Student ID': participants.length, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Total Feedbacks', 'Student ID': feedbacks.length, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Total Present', 'Student ID': attendance.filter(a => a.status === 'present').length, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Total Absent', 'Student ID': attendance.filter(a => a.status === 'absent').length, 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': '', 'Student ID': '', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' },
        { 'S.No': 'Participant List', 'Student ID': '', 'Name': '', 'Email': '', 'Department': '', 'Contact No': '', 'Feedback Rating': '', 'Feedback Comment': '', 'Attendance': '' }
      ];

      const finalData = [...eventInfo, ...excelData];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(finalData);

      ws['!cols'] = [
        { wch: 8 }, { wch: 15 }, { wch: 25 }, { wch: 30 },
        { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 40 }, { wch: 15 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Participants');
      const filename = `${eventDetails.name.replace(/[^a-z0-9]/gi, '_')}_Attendance_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      showSuccess('Excel file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export Excel file');
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
    
    .view-participants {
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
    }
    
    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .event-card {
      padding: 24px;
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }
    
    .event-card:hover {
      border-color: #0ea5e9;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(14, 165, 233, 0.15);
    }
    
    .event-card.selected {
      border-color: #1e40af;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      transform: scale(1.02);
    }
    
    .event-card h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 12px 0;
    }
    
    .event-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 8px;
      font-family: 'DM Sans', sans-serif;
    }
    
    .participant-count {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e40af;
      margin-top: 16px;
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
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .empty-state p {
      font-family: 'DM Sans', sans-serif;
      color: #64748b;
      margin: 0;
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
    
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .header-row h2 {
      margin: 0;
    }
    
    .export-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }
    
    .export-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(34, 197, 94, 0.35);
    }
    
    .info-banner {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: 14px;
      margin-bottom: 24px;
    }
    
    .info-banner.available {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      border: 1px solid #86efac;
    }
    
    .info-banner.unavailable {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 1px solid #fcd34d;
    }
    
    .info-banner-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .info-banner.available .info-banner-icon {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }
    
    .info-banner.unavailable .info-banner-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    
    .info-banner-text h4 {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 4px 0;
    }
    
    .info-banner-text p {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      color: #64748b;
      margin: 0;
    }
    
    .participants-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .participants-table th {
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      padding: 16px;
      text-align: left;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .participants-table th:first-child {
      border-radius: 12px 0 0 12px;
    }
    
    .participants-table th:last-child {
      border-radius: 0 12px 12px 0;
    }
    
    .participants-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      color: #334155;
      vertical-align: middle;
    }
    
    .participants-table tr:hover td {
      background: #f8fafc;
    }
    
    .participant-name {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .participant-photo {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      object-fit: cover;
    }
    
    .feedback-cell {
      padding: 12px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-radius: 10px;
      border: 1px solid #86efac;
    }
    
    .feedback-stars {
      display: flex;
      gap: 2px;
      justify-content: center;
      margin-bottom: 4px;
    }
    
    .feedback-rating {
      text-align: center;
      font-size: 0.85rem;
      font-weight: 600;
      color: #166534;
      margin-bottom: 4px;
    }
    
    .feedback-comment {
      font-size: 0.8rem;
      color: #64748b;
      font-style: italic;
      text-align: center;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .no-feedback {
      text-align: center;
      padding: 8px;
      color: #94a3b8;
      font-size: 0.85rem;
      font-style: italic;
    }
    
    .attendance-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    
    .attendance-status.present {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      color: #166534;
      border: 1px solid #86efac;
    }
    
    .attendance-status.absent {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #991b1b;
      border: 1px solid #fca5a5;
    }
    
    .attendance-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    
    .present-btn {
      padding: 8px 14px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    
    .present-btn:hover:not(:disabled) {
      transform: scale(1.05);
    }
    
    .present-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .absent-btn {
      padding: 8px 14px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    
    .absent-btn:hover:not(:disabled) {
      transform: scale(1.05);
    }
    
    .absent-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="view-participants">
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
      <div className="view-participants">
        <div className="page-header">
          <div className="header-icon">
            <Users size={28} color="white" />
          </div>
          <h1>View Participants</h1>
        </div>

        <div className="section-card">
          <h2>Select an Event</h2>
          {events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MailX size={40} color="#1e40af" />
              </div>
              <h3>No Approved Events</h3>
              <p>You don't have any approved events yet.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div
                  key={event._id}
                  className={`event-card ${selectedEvent === event._id ? 'selected' : ''}`}
                  onClick={() => fetchParticipants(event._id)}
                >
                  <h3>{event.name}</h3>
                  <div className="event-meta">
                    <Calendar size={16} />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="event-meta">
                    <MapPin size={16} />
                    {event.venue}
                  </div>
                  <div className="participant-count">
                    <Users size={18} />
                    {event.registeredStudents?.length || 0} Participants
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedEvent && (
          <div className="section-card">
            <div className="header-row">
              <h2>
                Participants List
                {eventDetails && (
                  <span style={{ fontWeight: 'normal', fontSize: '0.9rem', color: '#64748b', marginLeft: '12px' }}>
                    ({participants.length} {participants.length === 1 ? 'student' : 'students'})
                  </span>
                )}
              </h2>
              {participants.length > 0 && (
                <button className="export-btn" onClick={exportToExcel}>
                  <FileSpreadsheet size={18} />
                  Export to Excel
                </button>
              )}
            </div>

            {loadingParticipants ? (
              <div className="loading-state">
                <div className="loading-icon">
                  <Loader2 size={32} color="white" className="spin" />
                </div>
                <p>Loading participants...</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Users size={40} color="#1e40af" />
                </div>
                <h3>No Participants Yet</h3>
                <p>No students have registered for this event yet.</p>
              </div>
            ) : (
              <>
                {isEventStarted() ? (
                  <div className="info-banner available">
                    <div className="info-banner-icon">
                      <CheckCircle2 size={24} color="white" />
                    </div>
                    <div className="info-banner-text">
                      <h4>Attendance Marking Available</h4>
                      <p>Event has started. You can now mark student attendance.</p>
                    </div>
                  </div>
                ) : (
                  <div className="info-banner unavailable">
                    <div className="info-banner-icon">
                      <Clock size={24} color="white" />
                    </div>
                    <div className="info-banner-text">
                      <h4>Attendance Not Available Yet</h4>
                      <p>Attendance marking will be available after the event starts at {eventDetails?.time}</p>
                    </div>
                  </div>
                )}

                <div style={{ overflowX: 'auto' }}>
                  <table className="participants-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Contact</th>
                        <th style={{ textAlign: 'center' }}>Feedback</th>
                        {isEventStarted() && <th style={{ textAlign: 'center' }}>Attendance</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant, index) => {
                        const attendanceStatus = getAttendanceStatus(participant._id);
                        const isMarking = markingAttendance[participant._id];
                        const feedback = getFeedback(participant._id);

                        return (
                          <tr key={participant._id}>
                            <td>{index + 1}</td>
                            <td style={{ fontWeight: 600 }}>{participant.studentId || 'N/A'}</td>
                            <td>
                              <div className="participant-name">
                                {participant.photo ? (
                                  <img src={participant.photo} alt={participant.name} className="participant-photo" />
                                ) : (
                                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} color="white" />
                                  </div>
                                )}
                                {participant.name}
                              </div>
                            </td>
                            <td>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Mail size={14} color="#64748b" />
                                {participant.email}
                              </span>
                            </td>
                            <td>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Building2 size={14} color="#64748b" />
                                {participant.department || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Phone size={14} color="#64748b" />
                                {participant.contactNo || 'N/A'}
                              </span>
                            </td>
                            <td>
                              {feedback ? (
                                <div className="feedback-cell">
                                  <div className="feedback-stars">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={16}
                                        fill={i < feedback.rating ? '#22c55e' : 'none'}
                                        color={i < feedback.rating ? '#22c55e' : '#cbd5e1'}
                                      />
                                    ))}
                                  </div>
                                  <div className="feedback-rating">{feedback.rating}/5</div>
                                  <div className="feedback-comment" title={feedback.comment}>
                                    "{feedback.comment}"
                                  </div>
                                </div>
                              ) : (
                                <div className="no-feedback">No feedback yet</div>
                              )}
                            </td>
                            {isEventStarted() && (
                              <td>
                                {attendanceStatus ? (
                                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <span className={`attendance-status ${attendanceStatus}`}>
                                      {attendanceStatus === 'present' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                      {attendanceStatus === 'present' ? 'Present' : 'Absent'}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="attendance-buttons">
                                    <button
                                      className="present-btn"
                                      onClick={() => markAttendance(participant._id, 'present')}
                                      disabled={isMarking}
                                    >
                                      <CheckCircle2 size={14} />
                                      Present
                                    </button>
                                    <button
                                      className="absent-btn"
                                      onClick={() => markAttendance(participant._id, 'absent')}
                                      disabled={isMarking}
                                    >
                                      <XCircle size={14} />
                                      Absent
                                    </button>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewParticipants;
