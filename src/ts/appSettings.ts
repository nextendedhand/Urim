import ToDoTip from './ToDoTip';
import toDoData from './toDoData';
import ToDoDataManager from './toDoDataManager';
import Common from './common';


// アプリ管理画面を表示
const settingBtn = document.getElementById('setting-btn');
settingBtn.addEventListener('click', () => {
    document.getElementById("modal-content").style.display = "block";
    document.getElementById("modal-overlay").style.display = "block";        
}, false);

//モーダルウィンドウを閉じる
const modalCloseBtn = document.getElementById('modal-close');
modalCloseBtn.addEventListener('click',()=>{
    document.getElementById("modal-content").style.display = "none";
    document.getElementById("modal-overlay").style.display = "none";        
},false)

const genreAddBtn = document.getElementById('genreAdd');
genreAddBtn.addEventListener('click',()=>{

	const genreColor: HTMLInputElement =<HTMLInputElement>document.getElementById('newGenreColorPallet');
	const genreLabel: HTMLInputElement =<HTMLInputElement>document.getElementById('newGenreLabel');

	const color = genreColor.value;
	const label = genreLabel.value;
	createGenreData(color,label);
},false);

// ジャンルの追加
function createGenreData(color:string,label:string):void {
    // div 要素の作成と属性の指定
    const divElement = document.createElement("div");
	divElement.innerHTML = '<input type="color" id="colorpallet" name="head" value='+color+'> <label for="colorpallet">'+
							label+'</label> <p><a id="delete" class="button-link">削除</a></p>';    

    // li 要素の作成
    var newLi = document.createElement("li");
    newLi.appendChild ( divElement );
   
    // リストに追加
    var list = document.getElementById("genreList");
    list.appendChild( newLi );   
}

