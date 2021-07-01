import './App.css';
import {useState, useEffect, useRef} from 'react';

function App() {

  const url = "http://localhost:3005/";
  const [randWish, setRandWish] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [changeRandWish, setChangeRandWish] = useState(false);
  const authorText = useRef(null);
  const wishText = useRef(null);

  useEffect(() => {
    async function getRandWish() {
      await fetch(`${url}randomwish`)
        .then(data => data.json())
        .then(json => {
          const response = json[0];
          if(response.wish === ''){
            setRandWish(<img src="https://community.custom-cursor.com/uploads/default/original/2X/8/8df92e258c62cf229b714e2674cd9926bfcd0899.gif" />);
          } else {
            setRandWish(`${response.wish} - ${response.name}`);
          }
        })
    }

    getRandWish();
  }, [ hasLoaded, changeRandWish ]);

  if(!hasLoaded){
    setHasLoaded(true);
  }

  const changeWish = () => {
    setChangeRandWish(!changeRandWish);
  }

  const submitWish = async (e) => {
    e.preventDefault()
    const author = authorText.current.value === '' ? 'Anon' : authorText.current.value.substring(0, 255);
    const wish = wishText.current.value.substring(0, 255);
    let response = await fetch(`${url}wish`, {
      method: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        author: author,
        wish: wish})
    })
    authorText.current.value = '';
    wishText.current.value = '';
  }

  const checkMax = (e) => {
    e.preventDefault();
    e.target.value = e.target.value.substring(0, 255);
  }

  return (
    <div className="BigDiv">
      <div className="App">
        <h1>WishCHAN</h1>
        <div className="Random-Wish">
          {randWish}
        </div>
        <div className="New Submission Form">
          <form>
            <label className="author">Author: </label>
            <input type="text" ref={authorText} className="author" onChange={e => checkMax(e)} />
            <br />
            <textarea ref={wishText} className="wish" rows={5} onChange={e => checkMax(e)} />
            <br />
            <div className="send-button">
              <button onClick={submitWish}>Send it!</button>
              <button onClick={changeWish}>Refresh Wish</button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
