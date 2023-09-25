import React, { useState, useEffect } from "react";
import axios from "axios";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [expandedContactId, setExpandedContactId] = useState(null);

  useEffect(() => {
    fetch("/api/contacts")
      .then((response) => response.json())
      .then((data) => setContacts(data));
  }, []);

  return (
    <div className="container">
      <LoginPanel setLoggedIn={setLoggedIn} />
      <ContactsList
        contacts={contacts}
        loggedIn={loggedIn}
        expandedContactId={expandedContactId}
        setExpandedContactId={setExpandedContactId}
      />
    </div>
  );
}

function LoginPanel({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9000/api/contacts/login",
        {
          Email: email,
          Password: password,
        }
      );

      if (response.data && response.data.message) {
        setMessage(response.data.message);
        setLoggedIn(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("Invalid email or password.");
      } else {
        setMessage("Please try again later.");
      }
    }
  };

  return (
    <div className="login-panel">
      <h2>Login Panel</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

function ContactsList({ contacts, loggedIn, expandedContactId, setExpandedContactId }) {
    return (
      <div className="contacts-list">
        <h2>Contacts</h2>
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id} className="contact-item">
              <div className="contact-header"> {/* <-- Add this wrapping div */}
                <span>{contact.firstName} {contact.lastName}</span>
                {loggedIn && (
                  <button onClick={() =>
                      setExpandedContactId(
                        expandedContactId === contact.id ? null : contact.id
                      )
                    }
                  >
                    {expandedContactId === contact.id
                      ? "Hide Details"
                      : "Show Details"}
                  </button>
                )}
              </div> {/* <-- Close wrapping div */}
              
              {expandedContactId === contact.id && loggedIn && (
                <div className="contact-details">
                  <p>First name: {contact.firstName}</p>
                  <p>Last Name: {contact.lastName}</p>
                  <p>Email: {contact.email}</p>
                  <p>Category: {contact.category}</p>
                  <p>Phone Number: {contact.phoneNumber}</p>
                  <p>Date of birth: {contact.dateOfBirth}</p>
                  <button> Update Contact </button>
                  <button> Delete Contact </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
}


export default Contacts;
