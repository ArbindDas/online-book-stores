
import Navbar from './Navbar';
import Products from './Products';
import Footer from './Footer';


export default function Home() {
  return (
    <div>
      <Navbar/>
      <Products />
      {/* {user ? <h2>Welcome, {user}!</h2> : <h2>Please log in</h2>} */}
      <Footer/>
    </div>
  );
}
