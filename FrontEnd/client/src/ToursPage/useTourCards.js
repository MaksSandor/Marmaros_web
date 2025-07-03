import { useState, useEffect } from 'react';

function useTourCards() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/tours')
      .then(response => {
        if (!response.ok) {
          throw new Error('Помилка при завантаженні турів');
        }
        return response.json();
      })
      .then(data => setTours(data))
      .catch(error => console.error('Помилка при fetch:', error));
  }, []);
  return tours;
}

export default useTourCards;
