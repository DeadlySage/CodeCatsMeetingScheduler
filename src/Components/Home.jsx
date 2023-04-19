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
          padding: '30px 30px',
        }}
      >
        <h2>Are you a student or an instructor?</h2>
        <div
          className="button-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <button className="button" style={{ width: '200px' }}>
            <p>
              <MdSchool />
            </p>
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>Student</span>
          </button>

          <Link to="/appointment-selection">
            <button className="button" style={{ width: '200px' }}>
              <p>
                <FaSchool />
              </p>
              <span style={{ fontSize: 18, fontWeight: 'bold' }}>Instructor</span>
            </button>
          </Link>
        </div>
      </div>
    </IconContext.Provider>
  );
};

export default Home;
