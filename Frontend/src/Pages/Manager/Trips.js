import Grid from './Components/tripsgrid.js'
import Nav1 from './Components/navbar.js';
export default function TripsM() {
    const savedData = localStorage.getItem('forminput');
    console.log(savedData);
    return (
        <div>
            <h1 style={{ margin: "1%", textAlign: "center" }}>Trips</h1>
            <Grid />
        </div>

    );
}