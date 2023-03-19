import { MouseEvent, useEffect, useState } from 'react'
import './App.css'
import { Counter } from './features/counter/Counter'
import Coin from './features/coin/Coin'
import Theme from './features/theme/Theme'


const idb = window.indexedDB;

const createCollectionsIndexedDB = () => {
  if (!idb) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }
  console.log("idb", idb);
  const request = idb.open("SolarAppDB", 2);
  request.onerror = (e) => {
    console.log("Error", e);
    console.log("An Error occured with IndexedDB");
  }
  request.onupgradeneeded = (e) => {
    const db = request.result;
    if (!db.objectStoreNames.contains("userData")) {
      console.log("onupgradeneeded");

      db.createObjectStore("userData", {
        keyPath: "id",
      });
    }
  }
  request.onsuccess = (e) => {
    console.log("DataBase opened successfully");
  }
}

const App = () => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [allUsersData, setAllUsersData] = useState([])
  const [adduser, setAddUser] = useState(false)
  const [editUser, setEditUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})

  useEffect(() => {
    createCollectionsIndexedDB();
    getAll();
  })

  const reset = () => {
    setSelectedUser({})
    setFirstName('')
    setLastname('')
    setEmail('')
  }

  const getAll = () => {
    const dbPromise = idb.open("SolarAppDB", 2);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction('userData', 'readonly');
      const userData = tx.objectStore('userData');
      const users = userData.getAll()
      users.onsuccess = (query) => {
        setAllUsersData(query.srcElement.result)
      }
      users.onerror = (query) => {
        alert("Error occured while loading initial data");
      }
      tx.oncomplete = () => {
        db.close();
      }
    }
  }

  const handleSubmit = () => {
    const dbPromise = idb.open("SolarAppDB", 2);
    if (firstName && lastName && email) {
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const tx = db.transaction('userData', 'readwrite');
        const userData = tx.objectStore('userData');
        if (adduser) {
          const users = userData.put({
            id: allUsersData?.length + 1,
            firstName,
            lastName,
            email,
          })
          users.onsuccess = () => {
            tx.oncomplete = () => {
              db.close();
            }
            alert('User Added')
            reset();
          };
          users.onerror = (e) => {
            console.log(e);
            alert('Error occured')
          };
        } else {
          const users = userData.put({
            id: selectedUser?.id,
            firstName,
            lastName,
            email,
          })
          users.onsuccess = () => {
            tx.oncomplete = () => {
              db.close();
            }
            alert('User Updated')
            reset();
          };
          users.onerror = (e) => {
            console.log(e);
            alert('Error occured')
          };
        }
      }
    }
  }

  return (
    <div className="row" style={{ paddingTop: 50, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="col-md-12">
        <button className='btn btn-primary float-end mb-2'
          onClick={() => {
            setAddUser(true);
            setEditUser(false);
            reset();
          }}>Add</button>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>FirstName</th>
              <th>LastName</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsersData?.map((item) => {
              return (<tr key={item?.id}>
                <td>{item?.firstName}</td>
                <td>{item?.lastName}</td>
                <td>{item?.email}</td>
                <td>
                  <button className="btn btn-success"
                    onClick={() => {
                      setAddUser(false)
                      setEditUser(true)
                      setSelectedUser(item)
                      setFirstName(item?.firstName)
                      setLastname(item?.lastName)
                      setEmail(item?.email)
                    }}>
                    Edit
                  </button>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
      <div className='col-md-12'>
        {adduser || editUser ? <div className='card' style={{ padding: "20px" }}>
          <h3>{editUser ? "Update Users" : "Add Users"}</h3>
          <div className='form-group'>
            <label>FirstName</label>
            <input
              type="text"
              name='firstName'
              className='form-control'
              onChange={e => setFirstName(e.target.value)}
              value={firstName}
            />
          </div>
          <div className='form-group'>
            <label>LastName</label>
            <input
              type="lastName"
              name='text'
              className='form-control'
              onChange={e => setLastname(e.target.value)}
              value={lastName}
            />
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input
              type="email"
              name='email'
              className='form-control'
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className='form-group'>
            <button className='btn btn-primary mt-2' onClick={(e) => handleSubmit(e)}>
              {editUser ? "Update" : "Add"}
            </button>
          </div>
        </div> : null}

      </div>
    </div >
  )
}

export default App
