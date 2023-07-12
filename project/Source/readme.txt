# I. Hướng dẫn cài đặt:

- B1: Cài đặt [Visual Studio Code](https://code.visualstudio.com/download).

- B2: Cài đặt Live Sever extension tại Extension trong Visual Studio Code.

# II. Hướng dẫn sử dụng:

- B1: Sau khi giải nén file:"Project_20521852_20520817_20521443.7z" thì được thư mục "Project_20521852_20520817_20521443", trong thư mục "Project_20521852_20520817_20521443" có 1 thư mục con là "Source"

-B2: Mở Visual Studio Code => Chọn File => Chọn Open Folder => Chọn folder "Source" 

- B3: Click chuột phải vào file index.html -> chọn Open with Live Server sẽ hiện bài làm trên web.

- B4: Thực hiện các thao tác theo ý muốn từ mô tả ở mục III để sử dụng.

# III. Mô tả:

- Bên trên là thanh menu, chứa các lựa chọn theo thứ tự gồm:

    + Geometry: tạo các Geometry thông thường hoặc load model từ thư mục. 
      Khi muốn load model, đã có sẵn các file model để load từ máy nằm trong thư mục tên là "glb" trong thư mục "assets"

    + Style: chọn vẽ theo point, line hoặc là solid

    + Light: chọn phép chiếu như Point light hoặc Spot light, nếu không cần có thể chọn Remove light. Các nguồn sáng có thể di chuyển.

    + Texture: chọn các texture cho geometry, có thể chọn các texture có sẵn hoặc upload từ file của mình, hoặc nếu không cần có thể Remove texture
    
    + Animation: chọn chuyển động cho geometry, nếu không cần có thể chọn Remove

    + Background: chọn dạng hình nên sẵn có, gồm 3 dạng, nếu không cần thì có thể chọn Remove background để đưa hình nền về màu tùy chỉnh

- Tại bên trái của màn hình, ta sẽ thấy lần lượt các các nút chức năng để thực hiện các phép biến đổi affine cơ bản và trình phát nhạc.

    + Translate là nút tịnh tiến

    + Rotate là nút xoay

    + Scale là nút thu phóng tỷ lệ

    + Music để bật nhạc

    + Sau khi click vào 3 nút đầu, các thanh mũi tên điều khiển sẽ xuất hiện, người dùng có thể sử dụng chuột để thao tác điều khiến trên các thanh này nhằm thay đổi

    + Nếu không dùng nữa thì có thể click lại vào nút đó để tắt đi

- Tại bên phải của màn hình, là bộ điều khiển dat.GUI giúp điều chỉnh các thông số của camera, light và màu của geometry.

    + Background dùng để chỉnh màu của background

    + Color dùng để chỉnh màu của Geometry và Light

    + Camera dùng để chỉnh hướng của camera, tuy nhiên chúng ta có thể chỉnh góc nhìn của camera bằng chuột

    + Light Control để chỉnh độ sáng của ánh sáng và phạm vi chiếu sáng

# IV. Lưu ý:

- Chương trình chạy trừ bước tải ra thì trong quá trình chạy KHÔNG cần mạng internet

- Trước khi load model từ thư mục thì phải tạo trước 1 geometry, nếu không nó sẽ không thể thực hiện 3 phép biến đổi bên trái được

