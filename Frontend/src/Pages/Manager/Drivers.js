import DGrid from './Components/driversgrid.js'
import Nav1 from './Components/navbar.js';

export default function DriversList() {


   return (
      <div >
         <h1 style={{ margin: "1%" , textAlign: "center"}}>Drivers</h1>
         <DGrid />
      </div>

   );
}