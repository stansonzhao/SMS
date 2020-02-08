var dds = document.getElementsByClassName('dd');
var lastdom = dds[0];
var studentList = document.getElementsByClassName('studentList')[0];
var submit = document.getElementsByClassName('submit')[0];
var addInfo = document.getElementsByClassName('addInfo')[0];
var tbody = document.getElementsByTagName('tbody')[0];
var editWrapper = document.getElementsByClassName('edit-wrapper')[0];
var sex = document.getElementsByClassName('sex');
var sub = document.getElementsByClassName('sub')[0];
var reset = document.getElementsByClassName('reset')[0];
var addValueObj = {
    sNo: document.getElementsByClassName('num')[0],
    name: document.getElementsByClassName('name')[0],
    birth: document.getElementsByClassName('birth')[0],
    email: document.getElementById('email'),
    phone: document.getElementsByClassName('phone')[0],
    address: document.getElementsByClassName('address')[0],
}
var editObj = {
    editsNo: document.getElementsByClassName('editnum')[0],
    editname: document.getElementsByClassName('editname')[0],
    editbirth: document.getElementsByClassName('editbirth')[0],
    editemail: document.getElementById('editemail'),
    editphone: document.getElementsByClassName('editphone')[0],
    editaddress: document.getElementsByClassName('editaddress')[0],
    editsex: document.getElementsByClassName('editsex'),
}
dds[0].onclick = function () {
    lastdom.classList.remove('active')
    this.classList.add('active');
    studentList.style.display = 'block';
    addInfo.style.display = 'none';
    lastdom = this;
}
dds[1].onclick = function () {
    lastdom.classList.remove('active')
    this.classList.add('active')
    addInfo.style.display = 'block';
    studentList.style.display = 'none';
    lastdom = this;
}
tbody.onclick = function (e) {
    if (e.target.tagName == 'BUTTON' && e.target.className == 'edit') {
        editWrapper.style.display = 'block';
        getValue(e.target);
    }
    if (e.target.tagName == 'BUTTON' && e.target.className == 'delete') {
        if (confirm('确认删除吗？')) {
            remove(e.target);
        }
    }
}
editWrapper.onclick = function(e){
    if(e.target.className == 'modle'){
        editWrapper.style.display = 'none';
    }
}
function remove(target){
    var parent = target.parentElement.parentElement;
    var num = parent.getElementsByClassName('userNo')[0].innerText;
    // num = parseInt(num);
    // console.log(num);
    $.ajax({
        url:'http://open.duyiedu.com/api/student/delBySno',
        type:'get',
        data:{
            appkey: 'wenqiang_1580998441117',
            sNo:num
        }
    }).then(function(res){
        res = JSON.parse(res);
        // console.log(res);
        if(res.status == 'success'){
            target.parentElement.parentElement.remove();
            findAll();
        }
    })
}
function findSex(sexs) {
    for (var i = 0; i < sexs.length; i++) {
        if (sexs[i].checked) {
            var num = sexs[i].value
            num = parseInt(num);
            return num;
        }
    }
}

function add() {
    // console.log('进来了')
    $.ajax({
        url: 'http://open.duyiedu.com/api/student/addStudent',
        type: 'get',
        data: {
            appkey: 'wenqiang_1580998441117',
            sNo: addValueObj.sNo.value,
            name: addValueObj.name.value,
            sex: addValueObj.sex,
            birth: addValueObj.birth.value,
            phone: addValueObj.phone.value,
            email: addValueObj.email.value,
            address: addValueObj.address.value
        }
    }).then(function (res) {
        res = JSON.parse(res);
        if (res.status == 'fail') {
            alert('添加失败,' + res.msg)
            // console.log(1);
        } else if (res.status == 'success') {
            // dds[0].click();
            findAll();
            reset.click();
            alert('添加成功');
        }
    }, function (res) {
        alert('请求失败')
    })
}
submit.onclick = function () {
    addValueObj.sex =  findSex(sex);
    for (var prop in addValueObj) {
        if (addValueObj[prop].value == '') {
            alert('参数不能留空')
            return
        }
    }
    add();
}

function getValue(target) {
    var parent = target.parentElement.parentElement;
    var userValueObj = {}
    userValueObj.userNo = parent.getElementsByClassName('userNo')[0].innerText;
    userValueObj.userName = parent.getElementsByClassName('userName')[0].innerText;
    userValueObj.userSex = parent.getElementsByClassName('userSex')[0].innerText;
    userValueObj.userBirth = parent.getElementsByClassName('userBirth')[0].innerText;
    userValueObj.userEmail = parent.getElementsByClassName('userEmail')[0].innerText;
    userValueObj.userPhone = parent.getElementsByClassName('userPhone')[0].innerText;
    userValueObj.userAddress = parent.getElementsByClassName('userAddress')[0].innerText;
    function insert(){
        editObj.editsNo.value = userValueObj.userNo;
        editObj.editsNo.disabled = 'true';
        editObj.editname.value = userValueObj.userName; 
        if(userValueObj.userSex == '男'){
            editObj.editsex[0].checked = 'true';
        }else if(userValueObj.userSex == '女'){
            editObj.editsex[1].checked = 'true';
        }
        editObj.editbirth.value = userValueObj.userBirth;
        editObj.editemail.value = userValueObj.userEmail;
        editObj.editphone.value = userValueObj.userPhone;
        editObj.editaddress.value = userValueObj.userAddress;
    }
    insert();
    // console.log(userValueObj);
}
function upLoadInfo(){
    // var editInfo = document.getElementsByClassName('editInfo')[0];
    var obj = {};
    obj.sNo = editObj.editsNo.value;
    obj.name = editObj.editname.value;
    obj.birth = editObj.editbirth.value;
    obj.phone = editObj.editphone.value;
    obj.email = editObj.editemail.value;
    obj.address = editObj.editaddress.value;
    obj.sex =  findSex(editObj.editsex);
    $.ajax({
        url:'http://open.duyiedu.com/api/student/updateStudent',
        type:'get',
        data:{
            appkey: 'wenqiang_1580998441117',
            sNo:obj.sNo,
            name:obj.name,
            birth:obj.birth,
            phone:obj.phone,
            email:obj.email,
            address:obj.address,
            sex:obj.sex,
        }
    }).then(function(res){
        // console.log(typeof res)
        res = JSON.parse(res);
        if(res.status == 'success'){
            editWrapper.style.display = 'none';
            alert('修改成功');
        }else{
            alert('修改失败，'+res.msg);
        }
    },function (res) {
        console.log(res);
    })
}
sub.onclick = function(){
    upLoadInfo();
    findAll();
}
// $.ajax({
//     url: 'http://open.duyiedu.com/api/student/findAll',
//     type: 'get',
//     data: {
//         appkey: 'wenqiang_1580998441117',
//     }
// }).then(function (res) {
//     console.log(res);
// })

function findAll() {
    $.ajax({
        url:'http://open.duyiedu.com//api/student/findAll',
        type:'get',
        data:{
            appkey:'wenqiang_1580998441117'
        }
    }).then(function (res) {
        res = JSON.parse(res)
        // console.log(res);
        var data = res.data;

        var str = '';
        data.forEach(function (ele,index) {
            str += `<tr>
            <td class="userNo">${ele.sNo}</td>
            <td class="userName">${ele.name}</td>
            <td class="userSex">${ele.sex == 1 ? '女' : '男'}</td>
            <td class="userBirth">${ele.birth}</td>
            <td class="userEmail">${ele.email}</td>
            <td class="userPhone">${ele.phone}</td>
            <td class="userAddress">${ele.address}</td>
            <td>
                <button class="edit">编辑</button>
                <button class="delete">删除</button>
            </td>
        </tr>`
        })
        $('#content').html(str);
    })
}
findAll();