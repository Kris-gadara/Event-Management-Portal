import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/Toast';
import api from '../../utils/api';
import * as XLSX from 'xlsx';

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
      // Filter only approved events
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
      console.log('Fetching participants for event ID:', eventId);
      const response = await api.get(`/coordinator/event/${eventId}/participants`);
      console.log('Response received:', response.data);
      setParticipants(response.data.participants || []);
      setEventDetails(response.data.event);
      setAttendance(response.data.attendance || []);
      setFeedbacks(response.data.feedbacks || []);
      setSelectedEvent(eventId);
      setLoadingParticipants(false);
    } catch (error) {
      console.error('Error fetching participants:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);

      let errorMessage = 'Failed to fetch participants';
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if backend is running.';
      }

      showError(errorMessage);
      setLoadingParticipants(false);
      setSelectedEvent(null); // Reset selection on error
    }
  };

  const markAttendance = async (studentId, status) => {
    setMarkingAttendance(prev => ({ ...prev, [studentId]: true }));
    try {
      const response = await api.post(`/coordinator/event/${selectedEvent}/attendance`, {
        studentId,
        status
      });

      // Update local attendance state
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
      // Prepare data for Excel
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

      // Add event details at the top
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

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(finalData);

      // Set column widths
      ws['!cols'] = [
        { wch: 8 },  // S.No
        { wch: 15 }, // Student ID
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 20 }, // Department
        { wch: 15 }, // Contact No
        { wch: 18 }, // Feedback Rating
        { wch: 40 }, // Feedback Comment
        { wch: 15 }  // Attendance
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Participants');

      // Generate filename with event name and date
      const filename = `${eventDetails.name.replace(/[^a-z0-9]/gi, '_')}_Attendance_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      showSuccess('Excel file with attendance downloaded successfully! 📊');
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export Excel file');
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="section" style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>⏳</div>
            <h2>Loading events...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 style={{
        fontSize: '2.5rem',
        background: 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 'var(--space-lg)'
      }}>
        👥 View Participants
      </h2>

      {/* Events List */}
      <div className="section">
        <h3 style={{ marginBottom: 'var(--space-lg)', color: '#2d3748' }}>Select an Event</h3>

        {events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📭</div>
            <h3>No Approved Events</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              You don't have any approved events yet.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-lg)'
          }}>
            {events.map((event) => (
              <div
                key={event._id}
                className="card"
                style={{
                  padding: 'var(--space-lg)',
                  cursor: 'pointer',
                  border: selectedEvent === event._id ? '2px solid var(--primary-gradient-start)' : '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  transform: selectedEvent === event._id ? 'scale(1.02)' : 'scale(1)'
                }}
                onClick={() => fetchParticipants(event._id)}
              >
                <h3 style={{
                  marginBottom: 'var(--space-sm)',
                  color: '#2d3748',
                  fontSize: '1.2rem'
                }}>
                  {event.name}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#718096',
                  marginBottom: 'var(--space-sm)'
                }}>
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#718096',
                  marginBottom: 'var(--space-md)'
                }}>
                  📍 {event.venue}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#edf2f7',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4a5568'
                }}>
                  <span>👥</span>
                  <span>{event.registeredStudents?.length || 0} Participants</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Participants Table */}
      {selectedEvent && (
        <div className="section" style={{ marginTop: 'var(--space-xxl)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-lg)',
            flexWrap: 'wrap',
            gap: 'var(--space-md)'
          }}>
            <h3 style={{ color: '#2d3748', margin: 0 }}>
              Participants List
              {eventDetails && (
                <span style={{
                  marginLeft: 'var(--space-md)',
                  fontSize: '0.9rem',
                  color: '#718096',
                  fontWeight: 'normal'
                }}>
                  ({participants.length} {participants.length === 1 ? 'student' : 'students'})
                </span>
              )}
            </h3>
            {participants.length > 0 && (
              <button
                onClick={exportToExcel}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #48bb78, #38a169)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(72, 187, 120, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(72, 187, 120, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px rgba(72, 187, 120, 0.3)';
                }}
              >
                <span>📊</span> Export to Excel
              </button>
            )}
          </div>

          {loadingParticipants ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>⏳</div>
              <p>Loading participants...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>😔</div>
              <h3>No Participants Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
                No students have registered for this event yet.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              {/* Attendance Info Banner */}
              {isEventStarted() ? (
                <div style={{
                  marginBottom: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(56, 161, 105, 0.1))',
                  borderRadius: '12px',
                  border: '1px solid rgba(72, 187, 120, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>
                      Attendance Marking Available
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                      Event has started. You can now mark student attendance.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{
                  marginBottom: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.1), rgba(246, 173, 85, 0.1))',
                  borderRadius: '12px',
                  border: '1px solid rgba(237, 137, 54, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>⏰</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>
                      Attendance Not Available Yet
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                      Attendance marking will be available after the event starts at {eventDetails.time}
                    </p>
                  </div>
                </div>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f7fafc' }}>
                    <th style={{
                      padding: 'var(--space-md)',
                      textAlign: 'left',
                      borderBottom: '2px solid #e2e8f0',
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>
                      S.No
                    </th>
                    <th style={{
                      padding: 'var(--space-md)',
                      textAlign: 'left',
                      borderBottom: '2px solid #e2e8f0',
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>
                      Student ID
                    </th>
                    <th style={{
                      padding: 'var(--space-md)',
                      textAlign: 'left',
                      borderBottom: '2px solid #e2e8f0',
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>
                      Name
                    </th>
                    <th style={{
                      padding: 'var(--space-md)',
                      textAlign: 'left',
                      borderBottom: '2px solid #e2e8f0',
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>
                      Email
                    </th>
                    <th style={{
                      padding: 'var(--space-md)',
                      textAlign: 'left',
                      borderBottom: '2px solid #e2e8f0',
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>
                      Department
                    </th>
                    <th style={{
                      padding: 'var(--space-md)',
                      textAlign: 'left',
                      borderBottom: '2px solid #e2e8f0',
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>
                      Contact
                    </th>
                    <th style={{
                      padding: 'var(--space-md)',
                      textAlign: 'center',
                      borderBottom: '2px solid #e2e8f0',
                      color: '#2d3748',
                      fontWeight: '600',
                      minWidth: '200px'
                    }}>
                      Feedback
                    </th>
                    {isEventStarted() && (
                      <th style={{
                        padding: 'var(--space-md)',
                        textAlign: 'center',
                        borderBottom: '2px solid #e2e8f0',
                        color: '#2d3748',
                        fontWeight: '600'
                      }}>
                        Attendance
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, index) => {
                    const attendanceStatus = getAttendanceStatus(participant._id);
                    const isMarking = markingAttendance[participant._id];
                    const feedback = getFeedback(participant._id);

                    return (
                      <tr
                        key={participant._id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: 'var(--space-md)', color: '#4a5568' }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: '#4a5568', fontWeight: '600' }}>
                          {participant.studentId || 'N/A'}
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: '#2d3748', fontWeight: '600' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {participant.photo && (
                              <img
                                src={participant.photo}
                                alt={participant.name}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                            {participant.name}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: '#4a5568' }}>
                          {participant.email}
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: '#4a5568' }}>
                          {participant.department || 'N/A'}
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: '#4a5568' }}>
                          {participant.contactNo || 'N/A'}
                        </td>
                        <td style={{ padding: 'var(--space-md)' }}>
                          {feedback ? (
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              padding: '8px',
                              background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.08), rgba(56, 161, 105, 0.08))',
                              borderRadius: '8px',
                              border: '1px solid rgba(72, 187, 120, 0.2)'
                            }}>
                              {/* Star Rating */}
                              <div style={{
                                display: 'flex',
                                gap: '4px',
                                justifyContent: 'center',
                                fontSize: '1.1rem'
                              }}>
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      color: i < feedback.rating ? '#48bb78' : '#e2e8f0',
                                      textShadow: i < feedback.rating ? '0 2px 4px rgba(72, 187, 120, 0.3)' : 'none'
                                    }}
                                  >
                                    {i < feedback.rating ? '⭐' : '☆'}
                                  </span>
                                ))}
                              </div>
                              {/* Rating Number */}
                              <div style={{
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: '#2f855a'
                              }}>
                                {feedback.rating}/5
                              </div>
                              {/* Comment Preview */}
                              <div style={{
                                fontSize: '0.8rem',
                                color: '#4a5568',
                                fontStyle: 'italic',
                                textAlign: 'center',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }} title={feedback.comment}>
                                "{feedback.comment}"
                              </div>
                            </div>
                          ) : (
                            <div style={{
                              textAlign: 'center',
                              padding: '8px',
                              color: '#a0aec0',
                              fontSize: '0.85rem',
                              fontStyle: 'italic'
                            }}>
                              No feedback yet
                            </div>
                          )}
                        </td>
                        {isEventStarted() && (
                          <td style={{ padding: 'var(--space-md)' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                              {attendanceStatus ? (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  background: attendanceStatus === 'present'
                                    ? 'linear-gradient(135deg, rgba(72, 187, 120, 0.15), rgba(56, 161, 105, 0.15))'
                                    : 'linear-gradient(135deg, rgba(245, 101, 101, 0.15), rgba(229, 62, 62, 0.15))',
                                  border: `1px solid ${attendanceStatus === 'present' ? '#48bb78' : '#f56565'}`,
                                  fontWeight: '600',
                                  fontSize: '0.85rem'
                                }}>
                                  <span>{attendanceStatus === 'present' ? '✅' : '❌'}</span>
                                  <span style={{ color: attendanceStatus === 'present' ? '#2f855a' : '#c53030' }}>
                                    {attendanceStatus === 'present' ? 'Present' : 'Absent'}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => markAttendance(participant._id, 'present')}
                                    disabled={isMarking}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: 'linear-gradient(135deg, #48bb78, #38a169)',
                                      color: 'white',
                                      cursor: isMarking ? 'not-allowed' : 'pointer',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      transition: 'all 0.2s ease',
                                      opacity: isMarking ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isMarking) e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isMarking) e.target.style.transform = 'scale(1)';
                                    }}
                                  >
                                    ✅ Present
                                  </button>
                                  <button
                                    onClick={() => markAttendance(participant._id, 'absent')}
                                    disabled={isMarking}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: 'linear-gradient(135deg, #f56565, #e53e3e)',
                                      color: 'white',
                                      cursor: isMarking ? 'not-allowed' : 'pointer',
                                      fontWeight: '600',
                                      fontSize: '0.85rem',
                                      transition: 'all 0.2s ease',
                                      opacity: isMarking ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isMarking) e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isMarking) e.target.style.transform = 'scale(1)';
                                    }}
                                  >
                                    ❌ Absent
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewParticipants;
