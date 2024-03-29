import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import axios from 'axios'
import { getLoggedInUser} from '../AuthService';
import {UserRole, MeetingStatus, ClassType, MeetingType} from "./Constants";
import {
    Row,
    Col,
    Button,
    FormGroup,
    Label,
    Input,
    Container,
} from 'reactstrap';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import CustomModal from './CustomModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function Calendar() {

    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [modal, setModal] = useState(false);
    const [blockModal, setBlockModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const calendarRef = useRef(null);
    const tooltips = {};
    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(() => {
        const endDate = new Date();
        endDate.setMinutes(endDate.getMinutes() + 30);
        return endDate;
    });
    const [showOverlapBanner, setShowOverlapBanner] = useState(false);
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');
    const [type_id, setType_id] = useState();
    const [status, setStatus] = useState('');
    const [meetings, setMeetings] = useState([]);
    const [state, setState] = useState({});
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState();
    const [selectedClass, setSelectedClass] = useState();
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const initialValidationMessages = {
        class: '',
        instructor: '',
        title: '',
        attendees: '',
        link: '',
    
    };
    const [validationMessages, setValidationMessages] = useState(initialValidationMessages);
    var tooltip = null;

    const mapMeetingsToEvents = (meetings) => {
        return meetings.map(meeting => ({
            id: meeting._id,
            title: meeting.title || 'Untitled Meeting',
            start: meeting.start,
            end: meeting.end,
            link: meeting.link,
            notes: meeting.notes,
            status: meeting.status,
            type_id: meeting.type_id,
            class_name: meeting.class_name, 
            instructor_id: meeting.instructor_id,
            attendees: meeting.attendees
        }));
    }

    const [isLoggedInUserStudent, setIsLoggedInUserStudent] = useState(true);

    useEffect(async () => {
        let currentLoggedInUser = await getLoggedInUser();
        setIsLoggedInUserStudent(currentLoggedInUser.role_id === UserRole.student);
    }, []);

    useEffect(() => {
        async function fetchUserAndMeetings() {
            try {
                const allMeetingsResponse = await axios.get('/api/meetings');
                const allMeetings = allMeetingsResponse.data;
                const fetchedUser = await getLoggedInUser();

                setUser(fetchedUser);
                
                let relevantMeetings = [];

                if (fetchedUser) {
                    if (fetchedUser.role_id === 1) {
                        relevantMeetings = allMeetings.filter(
                            meeting => meeting.attendees.includes(fetchedUser._id));
                    } else if (fetchedUser.role_id === 2 || fetchedUser.role_id === 3) {
                        relevantMeetings = allMeetings.filter(
                            meeting => meeting.instructor_id && 
                            meeting.instructor_id.toString() === fetchedUser._id.toString());
                    }
                }

                setMeetings(mapMeetingsToEvents(relevantMeetings));

                // Preselect the logged-in student user in the attendees list if it's empty
                if (selectedAttendees.length === 0 && fetchedUser && fetchedUser.role_id === 1) {
                    setSelectedAttendees([
                        {
                            value: fetchedUser._id,
                            label: `${fetchedUser.first_name} ${fetchedUser.last_name}`,
                        },
                    ]);
                }
                // Preselect if logged-in user is instructor/admin
                else if(!selectedInstructor && fetchedUser && 
                    (fetchedUser.role_id === UserRole.instructor || fetchedUser.role_id === UserRole.admin))
                        setSelectedInstructor({
                            value: fetchedUser._id,
                            label: `${fetchedUser.first_name} ${fetchedUser.last_name}`,
                        });
     
            } catch (error) {
                console.error('Error fetching user or meetings:', error);
            }
        }

        fetchUserAndMeetings();
    }, [selectedAttendees]);

   

    function handleDateSelect(selectInfo) {
        if (
            selectInfo.view.type === 'timeGridWeek' ||
            selectInfo.view.type === 'timeGridDay' ||
            selectInfo.view.type === 'listYear'
        ) {
            selectInfo.view.calendar.unselect();
            setState({ selectInfo, state: 'create' });

            //Opens Modal Create
            console.log('open modal create');

            //Console Select Info
            setStart(selectInfo.start);
            setEnd(selectInfo.end);
            setModal(true); 
        }
    }

    const getEventColors = (meeting) => {
        let backgroundColor, textColor;

        if (meeting.type_id === 1) {
            switch (meeting.status) {
                case 'Approved':
                    backgroundColor = '#198754'; // success color - green
                    textColor = '#ffffff'; // white text color
                    break;
                case 'Pending':
                    backgroundColor = '#ffc107'; // warning color - yellow
                    textColor = '#0c0c0c'; // dark text color
                    break;
                default:
                    backgroundColor = '#dc3545'; // error color - red
                    textColor = '#ffffff'; // white text color
                    break;
            }
        } else if (meeting.type_id === 2) {
            backgroundColor = 'red'; // error color - red
            textColor = '#ffffff'; // white text color
        } else {
            // Default colors or null if not specified.
            backgroundColor = null;
            textColor = null;
        }

        return { backgroundColor, textColor };
    };

    function renderEventContent(eventInfo) {
        let { backgroundColor, textColor } = getEventColors(eventInfo.event.extendedProps);
        const style = {
            backgroundColor,
            borderRadius: '3px',
            border: '0.25px solid #aeaeae',
            color: textColor,
            padding: '4px 2px',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        };

        const className = eventInfo.event.extendedProps.class_name;
        const title = className ? `${className} - ${eventInfo.event.title}` : eventInfo.event.title;
        const startDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(eventInfo.event.start);
    
        const endDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(eventInfo.event.end);
    
        const notes = eventInfo.event.extendedProps.notes || "No notes provided";

        const EventTooltipContent = ({ title, startDate, endDate, notes }) => {
            return (
                <div>
                    <h3 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {title}
                    </h3>
                    <div>Start: {startDate}</div>
                    <div>End: {endDate}</div>
                    <div>Notes: {notes}</div>
                </div>
            );
        };

        return (
            <Tippy
                content={<EventTooltipContent title={title} startDate={startDate} endDate={endDate} notes={notes} />}
                theme="forest"
                zIndex={10}
            >
                <div>
                    <i
                        style={style}
                    >
                        {title}
                        {eventInfo.event.extendedProps.type_id === 2
                            ? <span> (Blocked)</span>
                            : (eventInfo.event.extendedProps.status === 'Pending' && <span> (Pending)</span>)}
                        {eventInfo.event.extendedProps.type_id !== 2 &&
                            (eventInfo.event.extendedProps.status === 'Approved' && <span> (Approved)</span>)}
                    </i>
                </div>
            </Tippy>
        );
    }

    const handleCloseModal = () => {
        handleClose();
        setModal(false);
        setBlockModal(false);
    };

    function handleEventClick(clickInfo) {
        if (clickInfo.event.extendedProps.type_id === 2) {
            clickInfo.jsEvent.preventDefault();
            setState({ clickInfo, state: 'update' });

            setTitle(clickInfo.event.title);
            setStart(clickInfo.event.start);
            setEnd(clickInfo.event.end);
            setNotes(clickInfo.event.extendedProps.notes);
            setBlockModal(true);

            return;
        }

        clickInfo.jsEvent.preventDefault();
        setState({ clickInfo, state: 'update' });

        setTitle(clickInfo.event.title);
        setStart(clickInfo.event.start);
        setEnd(clickInfo.event.end);
        setLink(clickInfo.event.extendedProps.link);
        setNotes(clickInfo.event.extendedProps.notes);
        setStatus(clickInfo.event.extendedProps.status);
        
        // Set the selected instructor based on the meeting's instructor_id
        const selectedInstructorData = instructors.find(
            (instructor) => instructor._id === clickInfo.event.extendedProps.instructor_id
        );
        setSelectedInstructor({
            value: selectedInstructorData._id,
            label: `${selectedInstructorData.first_name} ${selectedInstructorData.last_name}`,
        });

        // Set the selected class based on the meeting's class_name
        setSelectedClass({
            value: clickInfo.event.extendedProps.class_name,
            label: clickInfo.event.extendedProps.class_name,
        });

        // Set the selected attendees from the student ids
        const selectedAttendeesData = clickInfo.event.extendedProps.attendees.map(attendeeId => {
            const attendee = students.find(student => student._id === attendeeId);
            return {
                value: attendee._id,
                label: `${attendee.first_name} ${attendee.last_name}`,
            };
        });

        setSelectedAttendees(selectedAttendeesData);
        setModal(true);
    }

    function handleEvents(meetings) {
        setMeetings(meetings);
    }

    function handleEventDrop(checkInfo) {
        setState({ checkInfo, state: 'drop' });
        setConfirmModal(true);
    }

    function handleEventResize(checkInfo) {
        setState({ checkInfo, state: 'resize' });
        setConfirmModal(true);
    }

    function handleApprove() {
        handleEdit(MeetingStatus.approved);
    }

    function handleEdit(newStatus) {
        try {
            const meetingID = state.clickInfo.event.id;
            // state.clickInfo.event.setStart(start);
            // state.clickInfo.event.setEnd(end);
            // state.clickInfo.event.mutate({
            //     standardProps: { title }
            // });
            // state.clickInfo.event.setExtendedProp('link', link);
            // state.clickInfo.event.setExtendedProp('notes', notes);

            const updatedAttendees = selectedAttendees.map(selectedAttendee => selectedAttendee.value);
            
            const isValid = validateMeeting();
    
            if (isValid) {
                const updatePayload = {
                    title: title,
                    start: start,
                    end: end,
                    link: link,
                    notes: notes,
                    attendees: updatedAttendees, 
                    status: newStatus
                };

                axios.patch(`/api/meetings/${meetingID}`, updatePayload)
                    .then((response) => {
                        if (response.status === 200) {
                            console.log('Meeting updated successfully');

                            state.clickInfo.event.setStart(start);
                            state.clickInfo.event.setEnd(end);
                            state.clickInfo.event.mutate({standardProps: { title }});
                            state.clickInfo.event.setExtendedProp('link', link);
                            state.clickInfo.event.setExtendedProp('notes', notes);

                            handleClose();
                        }
                    })
                    .catch((error) => {
                        if (error.response.status === 300) {
                            console.log('Overlaps pre-existing meeting');
                            setShowOverlapBanner(true);
                        } else {
                            console.error('Error updating meeting:', error);
                        }
                    });
            } 
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    }

    function handleBlockEdit() {
        try {
            const meetingId = state.clickInfo.event.id;
            state.clickInfo.event.setStart(start);
            state.clickInfo.event.setEnd(end);
            state.clickInfo.event.setExtendedProp('notes', notes);

            const updatePayload = {
                start: start,
                end: end,
                notes: notes,
            };

            axios.patch(`/api/meetings/${meetingId}`, updatePayload)
                .then((response) => {
                    if (response.status === 200) {
                        console.log('Blocked time updated successfully');
                        handleClose();
                    }
                })
                .catch((error) => {
                    if (error.response.status === 300) {
                        console.log('Overlaps pre-existing meeting');
                        setShowOverlapBanner(true);
                    } else {
                        console.error('Error updating blocked time:', error);
                    }
                });

        } catch(error) {
            console.error('Error updating blocked time: ', error);
        }
    }

    const handleAttendeesSelect = (selectedStudents) => {
        setSelectedAttendees(selectedStudents);
    }

    const handleInstructorSelect = (instructor) => {
        setSelectedInstructor(instructor);
    };

    const handleClassSelect = (classType) => {
        setSelectedClass(classType);
    }

    async function handleSubmit() {
        const isValid = validateMeeting();

        if (isValid) {
            const meetingStatus = await getMeetingStatus(user);

            await axios.post("/api/meetings", {
                title: title,
                class_name: selectedClass.value,
                start: state.selectInfo?.startStr || start.toISOString(),
                end: state.selectInfo?.endStr || end.toISOString(),
                link: link,
                instructor_id: selectedInstructor.value,
                status: meetingStatus,
                notes: notes,
                type_id: 1,
                attendees: selectedAttendees.map(selectedAttendee => selectedAttendee.value),
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log('Meeting created successfully');
                    handleClose();
                }
            })
            .catch((error) => {
                if (error.response.status === 300) {
                    console.log('Overlaps pre-existing meeting');
                    setShowOverlapBanner(true);
                } else {
                    console.log(error);
                }
            });
        }
    }

    async function handleBlockSubmit() {
            const loggedInUser = await getLoggedInUser();

        await axios.post('/api/meetings', {
            title: 'Blocked Time',
            start: state.selectInfo?.startStr || start.toISOString(),
            end: state.selectInfo?.endStr || end.toISOString(),
            instructor_id: loggedInUser._id,
            status: MeetingStatus.approved,
            type_id: MeetingType.block,
            notes: notes
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('Blocked time created successfully');
                handleClose();
            }
        })
        .catch((error) => {
            if (error.response.status === 300) {
                console.log('Overlaps pre-existing meeting');
                setShowOverlapBanner(true);
            } else {
                console.log(error);
            }
        });
    }

    function validateMeeting() {
        const validationErrors = {};
    
        if (!selectedClass) {
            validationErrors.class = 'Please select a class.';
        }
    
        if (!selectedInstructor) {
            validationErrors.instructor = 'Please select an instructor.';
        }
    
        if (!title) {
            validationErrors.title = 'Please enter a team name.';
        }
    
        if (selectedAttendees.length === 0) {
            validationErrors.attendees = 'Please select at least one attendee.';
        }
    
        // Update state with validation errors
        setValidationMessages(validationErrors);
    
        // Return true if there are no validation errors
        return Object.keys(validationErrors).length === 0; 
    }

    async function getMeetingStatus(user) {
        try {
            if (user) {
                // Admin & Instructors meetings are approved by default.
                if (user.role_id !== UserRole.student) {
                    return MeetingStatus.approved;
                } else if(user.role_id === UserRole.student){
                    return MeetingStatus.pending;
                }
            }
            return ''; // Return a default value if user is not available
        } catch (error) {
            console.error('Error getting meeting status:', error);
            return ''; 
        }
    }

    function doesMeetingNeedApproval(newStatus) {
        try {
            if (user) {
                if (user.role_id !== UserRole.student && 
                    newStatus === MeetingStatus.pending) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.error('Error determining approval:', error);
            return false; 
        }
    }

    function handleDelete() {
        const meetingID = state.clickInfo.event.id;

        axios
            .delete(`/api/meetings/${meetingID}`)
            .then(() => {
                console.log('Meeting deleted successfully');
                state.clickInfo.event.remove();
                handleClose();
            })
            .catch((error) => {
                console.error('Error deleting meeting :', error);
            });
    }

    const handleDateChange = (date) => {
        setStart((prevStart) => {
            const newStart = new Date(prevStart);
            newStart.setFullYear(date.getFullYear());
            newStart.setMonth(date.getMonth());
            newStart.setDate(date.getDate());
            return newStart;
        });
        setEnd((prevEnd) => {
            const newEnd = new Date(prevEnd);
            newEnd.setFullYear(date.getFullYear());
            newEnd.setMonth(date.getMonth());
            newEnd.setDate(date.getDate());
            return newEnd;
        });
    };

    const handleStartTimeChange = (time) => {
        setStart((prevStart) => {
            const newStart = new Date(prevStart);
            newStart.setHours(time.getHours());
            newStart.setMinutes(time.getMinutes());
            newStart.setSeconds(0);
            return newStart;
        });
        setEnd((prevEnd) => {
            const newEnd = new Date(prevEnd);
            newEnd.setHours(time.getHours());
            newEnd.setMinutes(time.getMinutes() + 30);
            newEnd.setSeconds(0);
            return newEnd;
        });
    };

    const handleEndTimeChange = (time) => {
        setEnd((prevEnd) => {
            const newEnd = new Date(prevEnd);
            newEnd.setHours(time.getHours());
            newEnd.setMinutes(time.getMinutes());
            newEnd.setSeconds(0);
            if (newEnd <= start) {
                return start;
            } else {
                return newEnd;
            }
        });
    };

    function handleClose() {
        setTitle('');
        setStart(new Date());
        setEnd(() => {
            const endDate = new Date();
            endDate.setMinutes(endDate.getMinutes() + 30);
            return endDate;
        });
        setState({});
        setModal(false);
        setBlockModal(false);
        setShowOverlapBanner(false);
        setLink('');
        setNotes('');
        setType_id({});
        setSelectedClass('');
        setSelectedInstructor(null);
        setSelectedAttendees([]);
        setStatus('');
        setValidationMessages(initialValidationMessages);
    }

    useEffect(() => {
        axios.get('/api/users')
            .then((response) => {
                const instructorData = [];
                const studentData = [];

                for (const user of response.data) {
                    // Only adds approved Instructors & Admins to instructorData
                    if (user.role_id !== UserRole.student && user.status_id == 2) {
                        instructorData.push(user);
                    } else {
                        studentData.push(user);
                    }
                }

                setInstructors(instructorData);
                setStudents(studentData);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <Container maxwidth="lg">
            <div className='Calendar'>
                <Container>
                    <div className="row" style={{ marginBottom: 20 }}>
                        <div className='col'
                            style={{
                                paddingRight: 15,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <div className='new-meeting-button'
                                onClick={() => setModal(true)}
                            >
                                New Meeting                      
                            </div>
                        </div>
                    </div>
                    {!isLoggedInUserStudent && (
                        <div className="row" style={{ marginBottom: 20 }}>
                            <div className='col'
                                style={{
                                    paddingRight: 15,
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <div className='block-time-button'
                                    onClick={() => setBlockModal(true)}
                                >
                                    Blocked Time                 
                                </div>
                            </div>
                        </div>
                    )}
                    <Row>
                        <Col md={12}>
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                headerToolbar={{
                                    start: 'title',
                                    center: 'prev,today,next',
                                    end: 'dayGridMonth timeGridWeek timeGridDay listMonth'
                                }}
                                buttonText={{
                                    today: 'Today',
                                    month: 'Month',
                                    week: 'Week',
                                    day: 'Day',
                                    list: 'List'
                                }}
                                initialView='listMonth'
                                listDayFormat={{
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                }}
                                listDaySideFormat={false}
                                editable={false}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                weekends={weekendsVisible}
                                // select={handleDateSelect}
                                eventContent={renderEventContent}
                                events={meetings}
                                eventClick={handleEventClick}
                                eventDrop={handleEventDrop}
                                eventResize={handleEventResize}
                                
                                //dateClick={handleDateClick}
                                eventAdd={(e) => {
                                    console.log('eventAdd', e);
                                }}
                                eventChange={(e) => {
                                    console.log('eventChange', e);
                                }}
                                eventRemove={(e) => {
                                    console.log('eventRemove', e);
                                }}

                            />
                        </Col>
                    </Row>
                </Container>

                <CustomModal
                    title={state.state === 'update' ? `${selectedClass ? selectedClass.value : ''}: ${title}` : 'New Meeting'}
                    isOpen={modal}
                    toggle={handleCloseModal}
                    onCancel={handleCloseModal}
                    onSubmit={() => (state.clickInfo ? handleEdit(state.clickInfo.event.extendedProps.status) : handleSubmit())}
                    submitText={state.clickInfo ? 'Update' : 'Save'}
                    onDelete={state.clickInfo && handleDelete}
                    deleteText='Delete'
                    {...(state.clickInfo && doesMeetingNeedApproval(state.clickInfo.event.extendedProps.status) && {
                        onSuccess: () =>(handleApprove()),
                        successText: 'Approve',
                    })}
                >
                    <FormGroup>
                        <Label for='class' style={{ display: 'flex', alignItems: 'center' }}>Class <p style={{color: 'red'}}>*</p></Label>
                        <Select
                            placeholder='Select Class'
                            value={selectedClass}
                            options={[
                                { value: ClassType.CSC_190, label: ClassType.CSC_190 },
                                { value: ClassType.CSC_191, label: ClassType.CSC_191 },
                            ]}
                             onChange={handleClassSelect}
                             isDisabled={!!state.clickInfo}
                        />
                        <div className="validation-message">{validationMessages.class}</div>
                    </FormGroup>
                    
                    {user && ![UserRole.instructor, UserRole.admin].includes(user.role_id) && (
                    <FormGroup>
                        <Label for='instructor' style={{ display: 'flex', alignItems: 'center' }}>Instructor <p style={{color: 'red'}}>*</p></Label>
                        <Select
                            placeholder='Select Instructor'
                            value={selectedInstructor}
                            options={[
                                 ...instructors.map((instructor) => ({  
                                        value: instructor._id,
                                        label: `${instructor.first_name} ${instructor.last_name}`,
                                    }))
                                 ]}
                            onChange={handleInstructorSelect}
                            isDisabled={!!state.clickInfo}
                         />  
                        <div className="validation-message">{validationMessages.instructor}</div>
                    </FormGroup>
                    )}
                    
                    <FormGroup>
                        <Label for='title' style={{ display: 'flex', alignItems: 'center' }}>Team Name & Subject <p style={{color: 'red'}}>*</p></Label>
                        <Input
                            type='text'
                            name='title'
                            placeholder='Enter Team Name & Meeting Subject'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="validation-message">{validationMessages.title}</div>
                    </FormGroup>

                    <FormGroup>
                        <Label for='attendees' style={{ display: 'flex', alignItems: 'center' }}>Select Attendees <p style={{color: 'red'}}>*</p></Label>
                        <Select
                        isMulti
                             placeholder='Select Attendees'
                             value={selectedAttendees}
                             options={[
                                  ...students.map((student) => ({
                                         value: student._id,
                                         label: `${student.first_name} ${student.last_name}`,
                                     }))
                                  ]}
                             onChange={handleAttendeesSelect}
                        />
                        <div className="validation-message">{validationMessages.attendees}</div>
                    </FormGroup>                  

                    <Row>
                        <Col>
                            <Label for='date' style={{ display: 'flex', alignItems: 'center' }}>Date <p style={{color: 'red'}}>*</p></Label>
                        </Col>
                        <Col>
                            <Label for='startTime' style={{ display: 'flex', alignItems: 'center' }}>Start <p style={{color: 'red'}}>*</p></Label>
                        </Col>
                        <Col>
                            <Label for='endTime' style={{ display: 'flex', alignItems: 'center' }}>End <p style={{color: 'red'}}>*</p></Label>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <FormGroup>
                                <DatePicker
                                    selected={start}
                                    onChange={handleDateChange}
                                    dateFormat='M/dd/yyyy'
                                    className='form-control'
                                    disabled={status === MeetingStatus.approved}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <DatePicker
                                    selected={start}
                                    onChange={handleStartTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat='h:mm aa'
                                    className='form-control'
                                    disabled={status === MeetingStatus.approved}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <DatePicker
                                    selected={end}
                                    onChange={handleEndTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat='h:mm aa'
                                    className='form-control'
                                    disabled={status === MeetingStatus.approved}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
               
                    <FormGroup>
                        <Label for='link'>Meeting URL</Label>
                        <Input
                            type='text'
                            name='link'
                            placeholder='Enter Meeting URL'
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for='notes'>Notes</Label>
                        <Input
                            type='text'
                            name='notes'
                            placeholder='Enter Notes'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </FormGroup>

                    {showOverlapBanner && (
                        <div className="alert alert-danger fade show text-align-left">
                            Selected time slot is unavailable
                            <button type="button" className="close close-button" data-dismiss="alert" aria-label="Close" onClick={() => setShowOverlapBanner(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )}
                </CustomModal>

                <CustomModal
                    title={state.state === 'update' ? 'Update Block' : 'New Block'}
                    isOpen={blockModal}
                    toggle={handleCloseModal}
                    onCancel={handleCloseModal}
                    onSubmit={() => (state.clickInfo ? handleBlockEdit() : handleBlockSubmit())}
                    submitText={state.clickInfo ? 'Update' : 'Save'}
                    onDelete={state.clickInfo && handleDelete}
                    deleteText='Delete'
                >
                    <Row>
                        <Col>
                            <Label for='date' style={{ display: 'flex', alignItems: 'center' }}>Date <p style={{color: 'red'}}>*</p></Label>
                        </Col>
                        <Col>
                            <Label for='startTime' style={{ display: 'flex', alignItems: 'center' }}>Start <p style={{color: 'red'}}>*</p></Label>
                        </Col>
                        <Col>
                            <Label for='endTime' style={{ display: 'flex', alignItems: 'center' }}>End <p style={{color: 'red'}}>*</p></Label>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <FormGroup>
                                <DatePicker
                                    selected={start}
                                    onChange={handleDateChange}
                                    dateFormat='M/dd/yyyy'
                                    className='form-control'
                                    disabled={status === MeetingStatus.approved}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <DatePicker
                                    selected={start}
                                    onChange={handleStartTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat='h:mm aa'
                                    className='form-control'
                                    disabled={status === MeetingStatus.approved}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <DatePicker
                                    selected={end}
                                    onChange={handleEndTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat='h:mm aa'
                                    className='form-control'
                                    disabled={status === MeetingStatus.approved}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label for='notes'>Notes</Label>
                        <Input
                            type='text'
                            name='notes'
                            placeholder='Enter Notes'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </FormGroup>

                    {showOverlapBanner && (
                        <div className="alert alert-danger fade show text-align-left">
                            You already have a meeting at that time
                            <button type="button" className="close close-button" data-dismiss="alert" aria-label="Close" onClick={() => setShowOverlapBanner(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )}
                </CustomModal>

                <CustomModal
                    title={state.state === 'resize' ? 'Resize Event' : 'Drop Event'}
                    isOpen={confirmModal}
                    toggle={() => {
                        state.checkInfo.revert();
                        setConfirmModal(false);
                    }}
                    onCancel={() => {
                        state.checkInfo.revert();
                        setConfirmModal(false);
                    }}
                    cancelText='Cancel'
                    onSubmit={() => setConfirmModal(false)}
                    submitText={'OK'}
                >
                    Do you want to {state.state} this event?
                </CustomModal>
            </div>
        </Container>
    );
}

