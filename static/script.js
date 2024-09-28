const gradeValues={
    "O":10,
    "A+":9,
    "A":8,
    "B+":7,
    "B":6,
    "C":5
};


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
                            <th>Grade</th>
                        </tr>`;

    data.forEach(subject =>{
        table+= `<tr>
                        <td>${subject.code}</td>
                        <td>${subject.name}</td>
                        <td>${subject.credits}</td>
                        <td>
                        <select id=semester>
                            <option value="O">O</option>
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                        </td>
                      </tr>`;
    });
    table+='</table>';
    document.getElementById("tableContainer").innerHTML=table;
}

//GPA CALCULATION
function calculateGPA(){
    const rows=document.querySelectorAll("#tableContainer table tr");
    let totalcredits=0;
    let totalGradePoints=0;

    rows.forEach((row,index)=>{
        if(index===0) return;

        const credits=parseFloat(row.querySelector('.credits').innerText);
        const grade=row.querySelector('.grade').value;

        const gradeValue=gradeValues[grade];

        totalcredits += credits;
        console.log(totalcredits);
        totalGradePoints += credits * gradeValue;
    });

    const gpa = totalGradePoints/totalcredits;
    document.getElementById("gpadiv").innerText='Your GPA is: ${gpa.tofixed(2)}';
}
  
document.getElementById("gpa-button").addEventListener("click",calculateGPA);

    