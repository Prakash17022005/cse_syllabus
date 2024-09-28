async function getSemesterData() {
    const semester=document.getElementById("semester").value;
    if(semester){
        const response = await fetch (`/get_subjects?semester=${semester}`);
        const data = await response.json(); 
        renderTable(data);
    }
}

function renderTable(data){
    let table = `<table>
                        <tr>
                            <th>Subject Code</th>
                            <th>Subject Name</th>
                            <th>Credits</th>
                        </tr>`;

    data.forEach(subject =>{
        table+= `<tr>
                        <td>${subject.code}</td>
                        <td>${subject.name}</td>
                        <td>${subject.credits}</td>
                      </tr>`;
    });
    table+='</table>';
    document.getElementById("tableContainer").innerHTML=table;
}
    

    