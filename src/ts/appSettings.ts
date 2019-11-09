import ToDoTip from './ToDoTip';
import toDoData from './toDoData';
import ToDoDataManager from './toDoDataManager';
import settingsDataManager from './settingsDataManager';
import Common from './common';
const sdm = new settingsDataManager();

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

    writeDataToLocalStrate();

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
    var randnum = Math.floor( Math.random() * 1000 );
    // div 要素の作成と属性の指定
    const divElement = document.createElement("div");
	divElement.innerHTML = '<p name="genre" id='+ randnum +'><input type="color" id='+ randnum +' value='+color+'> <label for="colorpallet" id='+ randnum +'>'+
							label+'</label> <p><a href="javascript:void(0);" class="button-link" id='+ randnum
                            +' onclick="(function(){let elem = document.getElementById('+ randnum +'); elem2=elem.parentNode.parentNode; elem2.parentNode.removeChild(elem2);})()">削除</a></p></p>';    

    // li 要素の作成
    var newLi = document.createElement("li");
    newLi.appendChild ( divElement );
   
    // リストに追加
    var list = document.getElementById("genreList");
    list.appendChild( newLi );   
}

/*function createSettingsDataObject():void {
    let genreObjArray:genreData = [];
    let dataObj = new settingsData(genreObjArray,1);


}*/


function writeDataToLocalStrate():void {

    // ジャンルデータの取得・登録
    let genreElements = document.getElementsByName( "genre" ) ;
    console.log(genreElements)

    for (var oneGenreElement="", i = genreElements.length; i--;){
        var oneGenreElements = genreElements[i];
        console.log(oneGenreElements)
        console.log(oneGenreElements.childNodes[0])
        break
    }


    // 緊急度のスケール値取得・登録
    let scaleElements = document.getElementsByName( "options" ) ;

    // 選択状態の値を取得
    for ( var checkedValue="", i=scaleElements.length; i--; ) {
        var element = scaleElements[i] as HTMLInputElement       
        if ( element.checked ) {
            checkedValue = element.value ;
            break ;
        }
    }

    if ( checkedValue === "" ) {
        // 未選択状態
    } else {
        // aには選択状態の値が代入されている
        console.log( checkedValue ) ;
        console.log(sdm.settingsData);
        sdm.settingsData.setUrgencyScale(parseInt(checkedValue));
        console.log(sdm.settingsData.getUrgencyScale())
    }

    sdm.exportToLocalStorage();
}


//　読み込み時実行
(function(){
    let isLoadedSettingsData = sdm.importFromLocalStorage();
    console.log("testsetse");
    console.log(sdm.settingsData);

    let settingsData = sdm.settingsData;

    if (isLoadedSettingsData || settingsData){

    } 



})();

