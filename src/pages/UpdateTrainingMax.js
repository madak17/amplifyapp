import React, { useState, useEffect } from 'react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify'
import { API, Storage } from 'aws-amplify';
import { listNotes } from '../graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from '../graphql/mutations';
import { Link } from "react-router-dom";
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';

const initialFormState = { name: '', description: '' }

const UpdateTrainingMax = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
      onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData);
      });
      fetchNotes();
  }, []);

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return Auth.user ? (
    <div className="App">
      <h1>Update Training Max</h1>
      <Link to="/">
        Back
      </Link>
      <div id="CreateNote">
        <input
          onChange={e => setFormData({ ...formData, 'name': e.target.value})}
          placeholder="Note name"
          value={formData.name}
        />
        <input
          onChange={e => setFormData({ ...formData, 'description': e.target.value})}
          placeholder="Note description"
          value={formData.description}
        />
        <input
          type="file"
          onChange={onChange}
        />
        <button onClick={createNote}>Create Note</button>
      </div>
      <div style={{marginBottom: 30}}>
      {
        notes.map(note => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note)}>Delete note</button>
            {
              note.image && <img src={note.image} style={{width: 400}} />
            }
          </div>
        ))
      }
      </div>
    </div>
  ) : (
    <AmplifyAuthenticator hideDefault={true}>
      <AmplifySignIn slot="sign-in" hideSignUp />
    </AmplifyAuthenticator>
  );
}

export default UpdateTrainingMax;