import React, { useState, useEffect } from 'react';

const TopReps = () => {
  const [repoCount, setRepoCount] = useState(10);
  const [repositories, setRepositories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 10;

  useEffect(() => {
    fetchRepositories();
  }, [repoCount, currentPage]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/repositories?count=${repoCount}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('Error: Data is not an array', data);
        setRepositories([]);
        return;
      }

      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error.message);
      setRepositories([]); // Set empty array to handle the error case
    }
  };

  const handleDropdownChange = (event) => {
    setRepoCount(parseInt(event.target.value));
    setCurrentPage(1); // Reset to the first page when changing the number of repositories per page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination Logic
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repositories.slice(indexOfFirstRepo, indexOfLastRepo);

  return (
    <div className='container'>
      <h2 className="mb-4">Top GitHub Repositories</h2>

      <div className="mb-3">
        <label htmlFor="repoCount">Display:</label>
        <select id="repoCount" onChange={handleDropdownChange}>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <div>
        {currentRepos.map((repo) => (
          <div key={repo.name} className="border p-3 mb-3 rounded-3">
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
            <p>
              <strong>Stars:</strong> {repo.stars} |{' '}
              <a href={repo.url}  className="text-decoration-none" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {repositories.length > reposPerPage && (
        <div className="d-flex justify-content-center">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              {[...Array(Math.ceil(repositories.length / reposPerPage)).keys()].map((number) => (
                <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(number + 1)}
                  >
                    {number + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TopReps;