import React from 'react';

const AdminCreateForm = ({ show }) => {
  return (
    <div className="absolute flex justify-center w-full">
      <div
        className={
          'w-full max-w-2xl mt-4 shadow-2xl bg-white rounded p-8 transition-opacity ' +
          (show ? 'z-10 opacity-100' : 'z-hide opacity-0')
        }
        onClick={e => e.stopPropagation()}
      >
        <form>
          <div className="flex">
            <div className="w-1/2 pr-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Start Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="date"
                  value={start}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  End Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="date"
                  value={end}
                  required
                />
              </div>
            </div>

            <div className="w-1/2 pl-6 border-gray-300 border-l-2 border-dashed">
              <PositionsList
                list={positionsList}
                updateList={setPositionsList}
              />
            </div>
          </div>

          <button
            className="bg-purple-500 mx-auto block mt-6 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

const PositionsList = ({ list, updateList }) => {
  const [newPosition, setNewPosition] = useState('');
  const [error, setError] = useState('');

  function addNewPosition() {
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

      <ul className="mb-4">
        {Object.keys(list).map(key => (
          <li
            key={key}
            className="inline-block px-2 py-1 bg-gray-300 rounded-lg mr-3 mb-3 text-sm"
          >
            {list[key]}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap">
        <p className="w-full text-red-500 text-xs mb-1">{error}</p>
        <input
          className="shadow flex-1 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Add Positions"
          value={newPosition}
          onChange={e => setNewPosition(e.target.value)}
        />
        <button
          className="bg-blue-500 ml-2 shadow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={addNewPosition}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AdminCreateForm;
