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
var n = document.getElementsByClassName('n')[0];
var editForm = document.getElementsByClassName('editForm')[0];
var sform = document.getElementsByClassName('sform')[0];
var searchBtn = document.getElementsByClassName('searchBtn')[0];
var addForm = document.getElementsByClassName('addForm')[0];
var snum = '';
var str = '';
var page = 1;
var size = 10;
var totalPage = 0;
var nowPage = 1;
var dataArray = [];

function send(urlA, data, callback) {
    data.appkey = 'wenqiang_1580998441117'
    $.ajax({
        url: 'http://open.duyiedu.com/' + urlA,
        type: 'get',
        data: data,
    }).then(function (res) {
        res = JSON.parse(res);
        if(res.status == 'fail' && res.msg.includes('10000') !=-1){
            alert('后台访问'+res.msg+'无法获取数据');
            return;
        }
        callback && callback(res);
    })
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
        var index = e.target.dataset.index;
        getValue(index);
    }
    if (e.target.tagName == 'BUTTON' && e.target.className == 'delete') {
        if (confirm('确认删除吗？')) {
            remove(e.target);
        }
    }
}
editWrapper.onclick = function (e) {
    if (e.target.className == 'modle') {
        editWrapper.style.display = 'none';
    }
}

function remove(target) {
    var parent = target.parentElement.parentElement;
    var num = parent.getElementsByClassName('userNo')[0].innerText;
    send('api/student/delBySno', {
        sNo: num
    }, function (res) {
        if (res.status == 'success') {
            target.parentElement.parentElement.remove();
            findFenYe();
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
    var obj = {};
    if (!(/^\d{4}$/.test(addForm.birth.value))) {
        alert('出生年份不合规,仅需填写四位年份');
        return
    }
    if (!(/^\d{4,16}$/.test(addForm.sNo.value))) {
        alert('学号必须为4位以上16位以下的数字');
        return
    }
    if (!(/^\d{11}$/.test(addForm.phone.value))) {
        alert('手机号不合规,仅支持11位手机号');
        return
    }
    if (!(/\w+@\w+\.com/.test(addForm.email.value))) {
        alert('邮箱信息不合规范');
        return
    }
    obj.sNo = addForm.sNo.value;
    obj.birth = addForm.birth.value;
    obj.phone = addForm.phone.value;
    obj.name = addForm.name.value;
    obj.sex = addForm.sex.value;
    obj.address = addForm.address.value;
    obj.email = addForm.email.value;
    for(var prop in obj){
        obj[prop] = obj[prop].trim();
        if(obj[prop] == ''){
            alert('参数不能留空')
            return
        }
    }
    send('api/student/addStudent', obj, function (res) {
        if (res.status == 'fail') {
            alert('添加失败,' + res.msg)
        } else if (res.status == 'success') {
            // dds[0].click();
            findFenYe();
            reset.click();
            alert('添加成功');
        }
    })
}
submit.onclick = function () {
    add();
}

function getValue(index) {
    var obj = dataArray[index];
    function insert() {
        if (obj.sex == 1) {
            editForm.F.checked = true
        } else {
            editForm.M.checked = true
        }
        for (var prop in obj) {
            if (editForm['edit' + prop]) {
                editForm['edit' + prop].value = obj[prop]
            }
        }
    }
    insert();
}



function upLoadInfo() {
    var obj = {};
    obj.sNo = editForm.editsNo.value
    obj.name = editForm.editname.value;
    obj.birth = editForm.editbirth.value;
    obj.phone = editForm.editphone.value;
    obj.email = editForm.editemail.value;
    obj.address = editForm.editaddress.value;
    obj.sex = editForm.sex.value;

    send('api/student/updateStudent', obj, function (res) {
        if (res.status == 'success') {
            editWrapper.style.display = 'none';
            alert('修改成功');
        } else {
            alert('修改失败，' + res.msg);
        }
    })
}

searchBtn.onclick = function (e) {
    snum = sform.searchSex.value;
    str = sform.search.value;
    search();
    return false
}

function search() {
    str = str.trim()
    if (str == '' || str == ' ') {
        alert('搜索关键字不能为空')
        return
    }
    var obj = {
        sex: snum,
        search: str,
        page: page,
        size: size
    }
    send('api/student/searchStudent', obj, function (res) {
        totalPage = Math.ceil(res.data.cont / size);
        discern()
        appedToTbody(res.data.searchList);
    })
}

function discern() {
    if (nowPage == 1 && totalPage == 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none'
    }
    if (nowPage > 1) {
        prevBtn.style.display = 'inline-block';
    }
    if (nowPage == totalPage) {
        nextBtn.style.display = 'none';
    }
    if (nowPage == 1 && totalPage != 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block'
    }
    n.innerText = `${nowPage} / ${totalPage}`;
}

function appedToTbody(data) {
    var str = '';
    dataArray = data;
    data.forEach(function (ele, index) {
        str += `<tr>
        <td class="userNo">${ele.sNo}</td>
        <td class="userName">${ele.name}</td>
        <td class="userSex">${ele.sex == 1 ? '女' : '男'}</td>
        <td class="userBirth">${new Date().getFullYear() - (parseInt(ele.birth))}</td>
        <td class="userEmail">${ele.email}</td>
        <td class="userPhone">${ele.phone}</td>
        <td class="userAddress">${ele.address}</td>
        <td>
            <button class="edit" data-index=${index}>编辑</button>
            <button class="delete" data-index=${index}>删除</button>
        </td>
    </tr>`
    })
    $('#content').html(str);
}

function findFenYe() {
    var obj = {
        page: page,
        size: size
    }
    send('api/student/findByPage', obj, function (res) {
        totalPage = Math.ceil(res.data.cont / size);
        discern();
        appedToTbody(res.data.findByPage);
    })
}
findFenYe();
var nextBtn = document.getElementsByClassName('nextBtn')[0];
var prevBtn = document.getElementsByClassName('prevBtn')[0];
nextBtn.onclick = function () {
    page += 1;
    nowPage += 1;
    page >= totalPage ? totalPage : page;
    str == '' ? findFenYe() : search()
}
prevBtn.onclick = function () {
    nowPage -= 1;
    page -= 1;
    page <= 1 ? 1 : page;
    str == '' ? findFenYe() : search()
}

sub.onclick = function () {
    upLoadInfo();
    str == '' ? findFenYe() : search()
}