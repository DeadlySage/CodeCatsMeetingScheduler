import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { nanoid } from 'nanoid';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Tooltip } from 'bootstrap';
import axios from 'axios'
import { UserRole } from "./Constants";
import { getLoggedInUser } from '../AuthService';


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
import events from './events';
import CustomModal from './CustomModal';

let todayStr = new Date().toISOString().replace(/T.*$/, '');

export default function Calendar() {

    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const calendarRef = useRef(null);
    const tooltips = {};

    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [url, setUrl] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('null');
    const [notes, setNote] = useState('');
    const [status, setStatus] = useState('');
    const [type_id, setType_id] = useState();
    const [attendees, setAttendees] = useState([]);
    const [meetings, setMeetings] = useState([]);

    const mapMeetingsToEvents = (meetings) => {
        return meetings.map(meeting => ({
            id: meeting._id,
            title: meeting.title || 'Untitled Meeting',
            start: meeting.start,
            end: meeting.end,
            url: meeting.link,
            notes: meeting.notes,
            status: meeting.status,
            type_id: meeting.type_id,
        }));
    }

    useEffect(() => {
        async function fetchUserAndMeetings() {
            try {
                const allMeetingsResponse = await axios.get('/meetings');
                const allMeetings = allMeetingsResponse.data;
                const user = await getLoggedInUser();

                let relevantMeetings = [];
                if (user) {
                    if (user.role_id === 1) {
                        relevantMeetings = allMeetings.filter(meeting => meeting.attendees.includes(user._id));
                    } else if (user.role_id === 2 || user.role_id === 3) {
                        relevantMeetings = allMeetings.filter(meeting => meeting.instructor_id && meeting.instructor_id.toString() === user._id.toString());
                    }
                }

                setMeetings(mapMeetingsToEvents(relevantMeetings));
            } catch (error) {
                console.error('Error fetching user or meetings:', error);
            }
        }

        fetchUserAndMeetings();
    }, []);

    const handleCloseModal = () => {
        handleClose();
        setModal(false);
    };


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

    const getEventColor = (meeting) => {
        if (meeting.type_id === 1) {
            return meeting.status === 'Approved' ? '#198754' : '#ffc107';
        } else if (meeting.type_id === 2) {
            return 'red';
        }
        // Add more conditions as needed.
        return null; // Default color or null if not specified.
    };

    function renderEventContent(eventInfo) {
        let backgroundColor = getEventColor(eventInfo.event.extendedProps);
        const style = {
            backgroundColor,
            borderRadius: '3px',
            //border: '1px solid #000',
            color: 'black',
            padding: '4px 2px',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        };

        return (
            <div>
                <i
                    style={style}
                >
                    {eventInfo.event.title}
                    {eventInfo.event.extendedProps.type_id === 2
                        ? <span> (Blocked)</span>
                        : (eventInfo.event.extendedProps.status === 'Pending' && <span> (Pending)</span>)}
                    {eventInfo.event.extendedProps.type_id !== 2 &&
                        (eventInfo.event.extendedProps.status === 'Approved' && <span> (Approved)</span>)}
                </i>
            </div>
        );
    }



    function handleEventClick(clickInfo) {
        if (clickInfo.event.extendedProps.type_id === 2) {
            clickInfo.jsEvent.preventDefault();
            return;
        }
        clickInfo.jsEvent.preventDefault();
        setState({ clickInfo, state: 'update' });

        setTitle(clickInfo.event.title);
        setStart(clickInfo.event.start);
        setEnd(clickInfo.event.end);
        setUrl(clickInfo.event.url);
        setNote(clickInfo.event.note);
        setModal(true);

        if (tooltips[clickInfo.event.id]) {
            tooltips[clickInfo.event.id].dispose();
        }
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

    function handleEdit() {
        state.clickInfo.event.setStart(start);
        state.clickInfo.event.setEnd(end);
        state.clickInfo.event.mutate({
            standardProps: { title }
        });
        state.clickInfo.event.setProp('url', url);
        handleClose();
    }

    const [meetingStatus, setMeetingStatus] = useState('pending');

    const handleInstructorSelect = (instructor) => {
        setSelectedInstructor(instructor);
    };

    function handleSubmit() {

        //setMeetingStatus('pending');


        axios
            .post("/meetings", {
                title: '',
                start: state.selectInfo?.startStr || start.toISOString(),
                end: state.selectInfo?.endStr || end.toISOString(),
                url: '',
                instructor_id: selectedInstructor ? selectedInstructor.valueOf : null,
                status: 'pending',
                notes: '',
                type_id: 1,
                attendees: []
            })
            .then((response) => {
                console.log('Meeting created successfully');
                
                // let calendarApi = calendarRef.current.getApi();
                // calendarApi.addEvent(newEvent);

                handleClose();
            })
            .catch((error) => {
                console.error('Error creating meeting:', error);
            });


    }

    function handleDelete() {
        const meetingID = state.clickInfo.event.id;

        axios
            .delete(`/routes/meetings/%(meetingID`)
            .then(() => {
                console.log('Meeting deleted successfully');
                state.clickInfo.event.remove();
                handleClose();
            })
            .catch((error) => {
                console.error('Error deleting meeting :', error);
            });

    }

    function handleClose() {
        setTitle('');
        setStart(new Date());
        setEnd(new Date());
        setState({});
        setModal(false);
        setNote('');
        setType_id('1');
        setAttendees([]);
    }

    const [state, setState] = useState({});

    const [departments, setDepartments] = useState([
        { value: '1', label: 'All' },
        { value: '2', label: 'CSC 190' },
        { value: '3', label: 'CSC 191' },
    ]);
    
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        axios.get('/users')
            .then((response) => {
                const instructorData = [];
                const studentData = [];

                for (const user of response.data) {
                    if (user.role_id !== UserRole.student) {
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

    function onFilter(element){
        //console.log(element.value);
    }


    return (
        <Container maxwidth="lg">
            <div className='Calendar'>

                <Container>
                    <h1>Your Calendar</h1>
                    <Row style={{ marginBottom: 20 }}>

                        <div className='dropdowns'>

                            <Col
                                sm={{ size: 6 }}
                                md={{ size: 3 }}
                                style={{
                                    color: 'black',
                                    paddingLeft: 15
                                }}
                            >

                                <Select
                                    style={{ float: 'left' }}
                                    defaultValue={departments[0]}
                                    options={departments}
                                    onChange={(element) => onFilter(element)}
                                />

                            </Col>

                            <Col
                                sm={{ size: 6 }}
                                md={{ size: 3 }}
                                style={{
                                    color: 'black',
                                    paddingLeft: 15
                                }}
                            >

                            <Select
                                value={selectedInstructor}
                                onChange={handleInstructorSelect}
                                options={[
                                    { value: '', label: 'All Instructors' },
                                    ...instructors.map((instructor) => ({
                                        value: instructor._id,
                                        label: `${instructor.first_name} ${instructor.last_name}`,
                                    }))
                                ]}
                            />
                            
                        </Col>

                        </div>

                        <Col
                            sm={{ size: 3, offset: 6 }}
                            md={{ size: 3, offset: 6 }}
                            style={{
                                paddingRight: 15
                            }}
                        >
                            <Button
                                style={{ float: 'right' }}
                                color='success'
                                onClick={() => setModal(true)}
                            >
                                Add Meeting
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                headerToolbar={{
                                    left: 'prev,today,next',
                                    center: 'title',
                                    right: 'dayGridMonth, timeGridWeek, timeGridDay, listYear'
                                }}
                                buttonText={{
                                    today: 'Today',
                                    month: 'Month',
                                    week: 'Week',
                                    day: 'Day',
                                    list: 'My Meetings'
                                }}
                                initialView='dayGridMonth'
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                weekends={weekendsVisible}
                                select={handleDateSelect}
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

                                eventMouseEnter={function (info) {
                                    var tooltip = new Tooltip(info.el, {
                                        title: '<h3>' + info.event.title + '</h3>' +
                                            'Start: ' + info.event.start + '<br>' +
                                            'End: ' + info.event.end,
                                        placement: 'top',
                                        trigger: 'hover',
                                        container: 'body',
                                        html: true
                                    });
                                    tooltips[info.event.id] = tooltip;
                                }}
                                eventMouseLeave={function (info) {
                                    if (tooltips[info.event.id]) {
                                        tooltips[info.event.id].dispose();
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </Container>

                <CustomModal
                    title={state.state === 'update' ? 'My Meeting' : 'Add New Meeting'}
                    isOpen={modal}
                    toggle={handleCloseModal}
                    onCancel={handleCloseModal}
                    onSubmit={state.clickInfo ? handleEdit : handleSubmit}
                    submitText={state.clickInfo ? 'Update' : 'Save'}
                    onDelete={state.clickInfo && handleDelete}
                    deleteText='Delete'
                >
                    <FormGroup>
                        <Label for='email'>Team Name</Label>
                        <Input
                            type='text'
                            name='title'
                            placeholder='Enter Team Name'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for='email'>Start Date and Time - End Date and Time</Label>
                        <DateRangePicker
                            initialSettings={{
                                locale: {
                                    format: 'M/DD hh:mm A'
                                },
                                startDate: start,
                                endDate: end,
                                timePicker: true
                            }}
                            onApply={(event, picker) => {
                                setStart(new Date(picker.startDate));
                                setEnd(new Date(picker.endDate));
                            }}
                        >
                            <input className='form-control' type='text' />
                        </DateRangePicker>
                    </FormGroup>
                    <FormGroup>
                        <Label for='url'>Meeting URL</Label>
                        <Input
                            type='text'
                            name='url'
                            placeholder='Enter URL'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for='notes'>Notes</Label>
                        <Input
                            type='text'
                            name='note'
                            placeholder='Notes'
                            value={notes}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </FormGroup>




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

// CP-98
// update meeting view on mobile
