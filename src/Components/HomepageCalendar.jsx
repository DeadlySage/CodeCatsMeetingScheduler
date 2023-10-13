import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';

let todayStr = new Date().toISOString().replace(/T.*$/, '');


export default function HompageCalendar() {
    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [modal, setModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const calendarRef = useRef(null);
    const tooltips = {};

    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [url, setUrl] = useState('');

    const [meetings, setMeetings] = useState([]);

    const mapMeetingsToEvents = (meetings) => {
        return meetings.map(meeting => ({
            id: meeting._id,
            title: meeting.title,
            start: meeting.start,
            end: meeting.end,
            url: meeting.link,
        }));
    }

    useEffect(() => {
        // Fetch data from /meetings endpoint
        fetch('/meetings')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched meetings:", data);
                const events = mapMeetingsToEvents(data);
                console.log("Converted to events:", events);
                setMeetings(events);
            });
    }, []);


    const navigate = useNavigate();

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

    function renderEventContent(eventInfo) {
        return (
            <div>
                <i
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {eventInfo.event.title}
                </i>
            </div>
        );
    }



    function handleEventClick(clickInfo) {
        clickInfo.jsEvent.preventDefault();
        setState({ clickInfo, state: 'update' });

        setTitle(clickInfo.event.title);
        setStart(clickInfo.event.start);
        setEnd(clickInfo.event.end);
        setUrl(clickInfo.event.url);

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

    function handleSubmit() {
        const newEvent = {
            id: nanoid(),
            title,
            start: state.selectInfo?.startStr || start.toISOString(),
            end: state.selectInfo?.endStr || end.toISOString(),
            allDay: state.selectInfo?.allDay || false,
            url
        };

        let calendarApi = calendarRef.current.getApi();

        calendarApi.addEvent(newEvent);
        handleClose();
    }

    function handleDelete() {
        state.clickInfo.event.remove();
        handleClose();
    }

    function handleClose() {
        setTitle('');
        setStart(new Date());
        setEnd(new Date());
        setState({});
        setModal(false);
    }

    const [state, setState] = useState({});

    const [departments, setDepartments] = useState([
        { value: '1', label: 'All' },
        { value: '2', label: 'CSC 190' },
        { value: '3', label: 'CSC 191' },
    ]);

    function onFilter(element) {
        console.log(element.value);
    }

    return (
        <Container maxWidth="lg">
            <div className='Calendar'>
                <h1>Meeting Calendar</h1>
                <Container>
                    <Row style={{ marginBottom: 20 }}>

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
                            sm={{ size: 3, offset: 6 }}
                            md={{ size: 3, offset: 6 }}
                            style={{
                                paddingRight: 15
                            }}
                        >
                            <Button
                                style={{ float: 'right' }}
                                color='success'
                                onClick={() => navigate('/advisor-selection')}
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