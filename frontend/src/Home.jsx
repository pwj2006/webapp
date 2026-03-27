import React, { useEffect, useState } from 'react';

function Home() {
  const [msg, setMsg] = useState('Loading...');

  useEffect(() => {
    fetch('/api/hello/')
      .then((r) => r.json())
      .then((data) => setMsg(data.message))
      .catch(() => setMsg('Could not reach API'));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1>React + Django</h1>
      <p>
        API says: <strong>{msg}</strong>
      </p>
    </div>
  );
}

export default Home;