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
                        <td class="credits">${subject.credits}</td>
                        <td>
                        <select class="grade">
                            <option value="none">select</option>
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

    console.log("Button Clicked");

    const rows=document.querySelectorAll("#tableContainer table tr");
    let totalcredits=0;
    let totalGradePoints=0;

    rows.forEach((row,index)=>{
        if(index===0) return;

        const credits=parseFloat(row.querySelector('.credits').innerText);
        const grade=row.querySelector('.grade').value;

        const gradeValue=gradeValues[grade];
        if (!gradeValue) return;
        
        totalcredits += credits;
        console.log(totalcredits);
        totalGradePoints += credits * gradeValue;
    });

    const gpa = totalGradePoints/totalcredits;
    document.getElementById("gpadiv").innerText=`Your GPA is: ${gpa.toFixed(2)}`;
}
  
document.getElementById("gpa-button").addEventListener("click",calculateGPA);


// ✅ NEW: Add Elective Function
async function addElective() {
    const code = document.getElementById("electiveInput").value.trim();
    if (!code) {
        alert("Please enter a subject code.");
        return;
    }

    try {
        const response = await fetch(`/get_elective?code=${code}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            appendSubjectRow(data);
        }
    } catch (error) {
        console.error("Error fetching elective:", error);
    }
}

function appendSubjectRow(subject) {
    const table = document.querySelector("#tableContainer table");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${subject.code}</td>
        <td>${subject.name}</td>
        <td class="credits">${subject.credits}</td>
        <td>
            <select class="grade">
                <option value="none">select</option>
                <option value="O">O</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </select>
        </td>
    `;
    table.appendChild(row);
}


function addCustomSubject() {
    const code = document.getElementById("customCode").value.trim();
    const name = document.getElementById("customName").value.trim();
    const credits = parseFloat(document.getElementById("customCredits").value.trim());
    const grade = document.getElementById("customGrade").value;

    if (!code || !name || isNaN(credits) || credits <= 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const table = document.querySelector("#tableContainer table");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${code}</td>
        <td>${name}</td>
        <td class="credits">${credits}</td>
        <td>
            <select class="grade">
                
                <option value="O" ${grade === "O" ? "selected" : ""}>O</option>
                <option value="A+" ${grade === "A+" ? "selected" : ""}>A+</option>
                <option value="A" ${grade === "A" ? "selected" : ""}>A</option>
                <option value="B+" ${grade === "B+" ? "selected" : ""}>B+</option>
                <option value="B" ${grade === "B" ? "selected" : ""}>B</option>
                <option value="C" ${grade === "C" ? "selected" : ""}>C</option>
            </select>
        </td>
    `;
    table.appendChild(row);

    // Reset input fields
    document.getElementById("customCode").value = "";
    document.getElementById("customName").value = "";
    document.getElementById("customCredits").value = "";
    document.getElementById("customGrade").value = "O";
}


//Report Download
async function downloadReport(){
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF();

    let semester=document.getElementById("semester").value;
    let gpaText=document.getElementById("gpadiv").innerText;

    // Add heading
    doc.setFontSize(16);
    doc.text("GPA Report",80,15);

    // Add semester
    doc.setFontSize(12);
    doc.text(`Semester: ${semester}`, 14, 25);

    const rows=document.querySelectorAll("#tableContainer table tr");

    let tableData=[];
    rows.forEach((row)=>{
        const cells = row.querySelectorAll("th,td");
        const rowData=[];
        cells.forEach(cell=>{
            const select = cell.querySelector("select");
            if(select){
                rowData.push(select.value);
            }
            else{
                rowData.push(cell.innerText.trim());
            }
            });
        
        tableData.push(rowData);
    });

    //Format Table with autoTable
    doc.autoTable({
        startY:30,
        head:[tableData[0]],
        body:tableData.slice(1),
        theme:'grid',
        styles: { fontSize: 11 },
    headStyles: { fillColor: [22, 160, 133] },
        
    });

    let finalY=doc.lastAutoTable.finalY || 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(gpaText,14,finalY+10);

    doc.save("GPA_Report.pdf");

}


    