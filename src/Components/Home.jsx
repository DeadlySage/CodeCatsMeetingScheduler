import React from 'react';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaSchool } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';

const Home = () => {
  return (
    <IconContext.Provider value={{ size: '4em' }}>
      <div
        className="auth-form-container"
        style={{
          display: 'flex',
          justifyContent: 'top',
          padding: '20px 20px',
        }}
      >
        <h2>Are you a Student or an Instructor?</h2>
        <div
          className="button-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Link to="/student-selection-course">
            <button className="button" style={{ width: '200px', height: '200px' }}>
               <p>
                  <MdSchool />
                </p>
                <span style={{ fontSize: 20, fontWeight: 'bold' }}>Student</span>
              </button>
          </Link>

          <Link to="/login">
            <button className="button" style={{ width: '200px', height: '200px' }}>
              <p>
                <FaSchool />
              </p>
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>Instructor</span>
            </button>
          </Link>
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default Home;
