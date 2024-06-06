// この下にapikeyを添付











// プロジェクトにつなげる
const app = initializeApp(firebaseConfig);
// データベースにつなげる
const db = getFirestore(app);

const Storagedb = getStorage(app);
console.log(Storagedb);

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"
import {
    getFirestore,
    collection,
    addDoc,
    where,
    query,
    getDocs,
    setDoc,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 公式ガイドhttps://firebase.google.com/docs/web/learn-more?hl=ja#config-objectより。verがあってる？
// import { getStorage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";


// データ取得処理をし、htmlに表示させる。
// student データを表示
const qstudent = query(collection(db, "studentlist"), orderBy("nom", "asc"));
onSnapshot(qstudent, (querySnapshot) => {
    console.log(querySnapshot.docs);
    const studentdocuments = [];
    querySnapshot.docs.forEach(function (doc) {
        const studentdocument = {
            id: doc.id,
            data: doc.data(),
        };
        studentdocuments.push(studentdocument);
    });
    console.log(studentdocuments);
    const studenthtmlElements = [];
    studentdocuments.forEach(function (studentdocument) {
        studenthtmlElements.push(`
                <div class="student-card">
                    <p>No.${studentdocument.data.nom}
                    <p class="studentname" id="${studentdocument.id}">Name:${studentdocument.data.name}</p>
                    <p>Class:${studentdocument.data.class}</p>
                    <p>age:${studentdocument.data.age}</p>
                    <p>skil:${studentdocument.data.skil}</p>
                </div>
            `);
    });
    $("#studentlist").html(studenthtmlElements);
});

// staff データを表示
const qstaff = query(collection(db, "staff"), orderBy("nom", "asc"));
onSnapshot(qstaff, (querySnapshot) => {
    console.log(querySnapshot.docs);
    const staffdocuments = [];
    querySnapshot.docs.forEach(function (doc) {
        const staffdocument = {
            id: doc.id,
            data: doc.data(),
        };
        staffdocuments.push(staffdocument);
    });
    console.log(staffdocuments);
    const staffhtmlElements = [];
    staffdocuments.forEach(function (staffdocument) {
        staffhtmlElements.push(`
            <div class="staff-card">
                <p>No.${staffdocument.data.nom}
                <p class="staffname" id="${staffdocument.id}">Name:${staffdocument.data.name}</p>
                <p>Class:${staffdocument.data.class}</p>
                <p>age:${staffdocument.data.age}</p>
                <p>skil:${staffdocument.data.skil}</p>
            </div>
            `);
    });
    $("#stafflist").html(staffhtmlElements);
});


// ボタンを押してコレクションへデータを送信
$("#save").on("click", function () {
    const typeselectvalue = $
        ("#type").val();
    const studentlistdb = 1;
    const postData = {
        nom: $("#nom").val(),
        name: $("#name").val(),
        class: $("#class").val(),
        age: $("#age").val(),
        skil: $("#skil").val(),
        time: serverTimestamp(),
    };
    console.log(postData);
    if (typeselectvalue == studentlistdb) {
        console.log(postData);
        addDoc(collection(db, "studentlist"), postData);
        alert("studentを登録しました");
    } else {
        addDoc(collection(db, "staff"), postData);
        alert("staffを登録しました");
    };
    $("#nom").val("");
    $("#name").val("");
    $("#class").val("");
    $("#age").val("");
    $("#skil").val("");
});

// ドキュメントをfirestoreから読み込む
$('#reload').click(async function () {
    var typeselectvalue = $
        ("#type").val();
    const studentlistdb = 1;
    const reload_nom = $('#reloadnom').val();
    if (typeselectvalue == studentlistdb) {
        const docNom1 = query(collection(db, "studentlist"), where('nom', '==', (reload_nom)));
        const querySnapshot1 = await getDocs(docNom1);
        querySnapshot1.forEach((doc) => {
            const reloaddoc1 = {
                id: doc.id,
                data: doc.data(),
            };
            console.log(reloaddoc1);
            $('#nom').val('テスト');
            console.log('Set test value to #nom:', $('#nom').val());
            $("#nom").val(reloaddoc1.data.nom);
            console.log('Set value to #nom:', reloaddoc1.data.nom, $('#nom').val());
            $("#name").val(reloaddoc1.data.name);
            $("#class").val(reloaddoc1.data.class);
            $("#age").val(reloaddoc1.data.age);
            // $("#skil").val(reloaddoc1.data.skil);
        });
    } else {
        const docNom2 = query(collection(db, "staff"), where('nom', '==', (reload_nom)));
        const querySnapshot2 = await getDocs(docNom2);
        querySnapshot2.forEach((doc) => {
            const reloaddoc2 = {
                id: doc.id,
                data: doc.data(),
            };
            console.log(reloaddoc2);
            $("#nom").val(reloaddoc2.data.nom);
            $("#name").val(reloaddoc2.data.name);
            $("#class").val(reloaddoc2.data.class);
            $("#age").val(reloaddoc2.data.age);
            $("#skil").val(reloaddoc2.data.skil);
        });
    };
    });

// ドキュメントをfirestoreへ上書き
$('#overwrite').click(async function () {
    var typeselectvalue = $
        ("#type").val();
    const studentlistdb = 1;
    const reload_nom = $('#reloadnom').val();
    const overwriteData = {
        nom: $("#nom").val(),
        name: $("#name").val(),
        class: $("#class").val(),
        age: $("#age").val(),
        skil: $("#skil").val(),
        time: serverTimestamp(),
    };
    if (typeselectvalue == studentlistdb) {
        const docNom = query(collection(db, "studentlist"), where('nom', '==', (reload_nom)));
        const querySnapshot = await getDocs(docNom);
        querySnapshot.forEach((doc) => {
            console.log(overwriteData);
            const docref = doc.ref;
            console.log(docref);
            setDoc(docref, overwriteData, { merge: false });
        });
    } else {
        const docNom = query(collection(db, "staff"), where('nom', '==', (reload_nom)));
        const querySnapshot = await getDocs(docNom);
        querySnapshot.forEach((doc) => {
            console.log(overwriteData);
            const docref = doc.ref;
            console.log(docref);
            setDoc(docref, overwriteData, { merge: false });
        });
    };
    
    $("#nom").val("");
    $("#name").val("");
    $("#class").val("");
    $("#age").val("");
    $("#skil").val("");
});

$('#reset').click(function () {
    $("#nom").val("");
    $("#name").val("");
    $("#class").val("");
    $("#age").val("");
    $("#skil").val("");
});