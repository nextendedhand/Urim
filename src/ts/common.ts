/**
 * 複数のtsファイルから参照する定数データを格納する
 */
class Common {
    public backgroundColor = ['#fe5721', '#1f1f1f', '#fe9800', '#3f3f3f', '#6f6f6f', '#6f6f6f', '#9f9f9f', '#9f9f9f'];
    public imToNum: { [s: string]: number } = {
        'S': 0,
        'A': 1,
        'B': 2,
        'C': 3
    };
    public key = {
        toDoData: 'toDoDataArray',
        settingsData: 'settingsData',
        selectedId: 'selectedId'
    };
}

export default Common;
