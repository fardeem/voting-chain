import React, { useState, useEffect, useContext } from 'react';
import { db } from '../api/firebase';
import DataContext from '../api/DataProvider';

const AdminCreateForm = ({ show, setShow }) => {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [positionsList, setPositionsList] = useState({});
  const { elections } = useContext(DataContext);

  useEffect(() => {
    function closeOnEscape(e) {
      if (e.key !== 'Escape') return;
      setShow(false);
    }

    document.addEventListener('keyup', closeOnEscape);
    return () => {
      document.removeEventListener('keyup', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    resetForm();
  }, [show]);

  function resetForm() {
    setName('');
    setStart('');
    setEnd('');
    setPositionsList('');
  }

  function handleSubmit() {
    if (
      elections.find(
        election => election.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert('Election with this name already exists.');
      return;
    }

    setShow(false);

    db.collection('elections')
      .add({
        name,
        start: new Date(start),
        end: new Date(end),
        positions: positionsList,
        nominations: Object.keys(positionsList).reduce((accumulator, key) => {
          accumulator[key] = [];
          return accumulator;
        }, {})
      })
      .then(() => {
        resetForm();
      })
      .catch(err => {
        console.log(err);
        setShow(true);
      });
  }

  return (
    <div className="absolute left-0 flex justify-center w-full">
      <div
        className={`w-4/5 max-w-2xl mt-4 shadow-2xl bg-white rounded p-8 transition-opacity ${
          show ? 'z-10 opacity-100' : 'z-hide opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="md:flex">
          <div className="w-full md:w-1/2 md:pr-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Start Date
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="date"
                value={start}
                required
                onChange={e => {
                  setStart(e.target.value);
                }}
                max={end}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                End Date
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="date"
                value={end}
                required
                onChange={e => {
                  setEnd(e.target.value);
                }}
                min={start}
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-6 border-gray-300 border-dashed md:border-l-2 ">
            <PositionsList list={positionsList} updateList={setPositionsList} />
          </div>
        </div>

        <button
          className="bg-purple-500 mx-auto block mt-6 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleSubmit}
        >
          Create
        </button>
      </div>
    </div>
  );
};

const PositionsList = ({ list, updateList }) => {
  const [newPosition, setNewPosition] = useState('');
  const [error, setError] = useState('');

  function addNewPosition(e) {
    e.preventDefault();

    const key = newPosition
      .trim()
      .toLowerCase()
      .replace(' ', '-');

    if (key.length === 0) return;

    if (Object.keys(list).includes(key)) {
      setError('Position already exists. Please make a new one.');
      return;
    }

    updateList(Object.assign({}, list, { [key]: newPosition }));
    setNewPosition('');
    setError('');
  }

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Positions
      </label>

      <ul>
        {Object.keys(list).map(key => (
          <li
            key={key}
            className="inline-block px-2 py-1 bg-gray-300 rounded-lg mr-3 mb-3 text-sm"
          >
            {list[key]}
            <span
              className="ml-2 cursor-pointer text-gray-500 hover:text-black"
              onClick={() => {
                const newList = { ...list };
                delete newList[key];
                updateList(newList);
              }}
            >
              &times;
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={addNewPosition} className="flex flex-wrap">
        <input
          className="flex-1 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Add Positions"
          value={newPosition}
          onChange={e => setNewPosition(e.target.value)}
        />
        <button
          className="bg-blue-500 ml-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={addNewPosition}
        >
          Add
        </button>
        <p className="w-full text-red-500 text-xs mt-1">{error}</p>
      </form>
    </div>
  );
};

export default AdminCreateForm;
