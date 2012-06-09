/* drag and drop auploader client side js */

(function () {

    function CreateHttpObject() {
        var httpObject = false;
        try {
            httpObject = new XMLHttpRequest();
        } catch (e) {    // IE
            var XmlHttpVersions = new Array("MSXML2.XMLHTTP.6.0",
                "MSXML2.XMLHTTP.5.0",
                "MSXML2.XMLHTTP.4.0",
                "MSXML2.XMLHTTP.3.0",
                "MSXML2.XMLHTTP",
                "Microsoft.XMLHTTP");

            for (var i = 0; i < XmlHttpVersions.length && !httpObject; i++) {
                try {
                    httpObject = new ActiveXObject(XmlHttpVersions[i]);
                } catch (e) {
                } // ignore it
            }
        }

        if (!httpObject) {
            displayError("Error while creating the XMLHttpRequest object.");
            return false;
        } else {
            return httpObject;
        }
    }


    // getElementById
    function $id(id) {
        return document.getElementById(id);
    }


    // output information
    function Output(msg) {
        var m = $id("messages");
        m.innerHTML = msg + m.innerHTML;
    }


    // file drag hover
    function FileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == "dragover" ? "hover" : "");
    }


    // file selection
    function FileSelectHandler(e) {
        // cancel event and hover styling
        FileDragHover(e);

        // fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // process all File objects
        for (var i = 0, f; f = files[i]; i++) {
            ParseFile(f);
            UploadFile(f);
        }
    }


    // output file information
    function ParseFile(file) {
        Output(
            "<p>File information: <strong>" + file.name +
                "</strong> type: <strong>" + file.type +
                "</strong> size: <strong>" + file.size +
                "</strong> bytes</p>"
        );

        if (file.type.indexOf("image") == 0) {       //image
            var reader = new FileReader();
            reader.onload = function (e) {
                Output(
                    "<p><strong>" + file.name + ":</strong><br />" +
                        '<img src="' + e.target.result + '" /></p>'
                );
            }
            reader.readAsDataURL(file);
        } else if (file.type.indexOf("text") == 0 ||
            file.type == "application/x-php" ||
            file.type == "application/xml") {       //text
            var reader = new FileReader();
            reader.onload = function (e) {
                Output(
                    "<p><strong>" + file.name + ":</strong></p><pre>" +
                        e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
                        "</pre>"
                );
            }
            reader.readAsText(file);
        } else {                                     //another type
            var reader = new FileReader();
            reader.onload = function (e) {
                Output("<p><strong>Another file: " + file.name + ":</strong></p>");
            }
            reader.readAsDataURL(file);
        }

    }


    // upload files
    function UploadFile(file) {
        // following line is not necessary: prevents running on SitePoint servers
        if (location.host.indexOf("sitepointstatic") >= 0)
            return

        var xhr = CreateHttpObject();
        //if (xhr.upload && file.type == "image/jpeg" && file.size <= $id("MAX_FILE_SIZE").value) {

        // create progress bar
        var o = $id("progress");
        var progress = o.appendChild(document.createElement("p"));
        progress.appendChild(document.createTextNode("upload " + file.name));

        // progress bar
        xhr.upload.addEventListener("progress", function (e) {
            var pc = parseInt(100 - (e.loaded / e.total * 100));
            progress.style.backgroundPosition = pc + "% 0";
        }, false);

        // file received/failed
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                progress.className = (xhr.status == 200 ? "success" : "failure");
                //document.getElementById("messages").innerHTML = xhr.responseText;
                //Output("<p>" + xhr.responseText + "</p>");
            }
        };

        // start upload
        xhr.open("POST", $id("upload").action, true);
        xhr.setRequestHeader("X_FILENAME", file.name);
        xhr.send(file);
        //}
    }


    // initialize
    function Init() {
        var fileselect = $id("fileselect"),
            filedrag = $id("filedrag"),
            submitbutton = $id("submitbutton");

        // file select
        fileselect.addEventListener("change", FileSelectHandler, false);

        // is XHR2 available?
        var xhr = CreateHttpObject();
        if (xhr.upload) {
            // file drop
            filedrag.addEventListener("dragover", FileDragHover, false);
            filedrag.addEventListener("dragleave", FileDragHover, false);
            filedrag.addEventListener("drop", FileSelectHandler, false);
            filedrag.style.display = "block";

            // remove submit button
            submitbutton.style.display = "none";
        }
    }

    // call initialization file
    if (window.File && window.FileList && window.FileReader) {
        Init();
    }
})();