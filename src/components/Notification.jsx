import PropTypes from 'prop-types';
import React from 'react';

const Notification = ({ message, isSuccessful }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`box ${isSuccessful ? 'success' : 'error'}`}>
      {message}
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string,
  isSuccessful: PropTypes.bool.isRequired
};

export default Notification;