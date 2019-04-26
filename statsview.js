class Stats extends HTMLTableElement
{
  set show(data)
  {
    //show the stats on the page as a table.
    // Clear previous
    this.innerHTML="";
    // Enumerate through the data object's key and value pairs.
    //for each item of stats, create a table with key and value.
    Object.entries(data).forEach(([key,value]) =>{
      // New row and table cells for key and value.
      var row = document.createElement("tr");
      var a = document.createElement("td");
      var b = document.createElement("td");
      a.innerHTML=key;
      b.innerHTML=value;
      row.appendChild(a);
      row.appendChild(b);
      this.appendChild(row);
    });
  }
}
