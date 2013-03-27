(ql:quickload :wuwei)

(net.aserve:publish-directory :prefix "/joyce1" :destination "/misc/working/joyce1/")

;; (net.aserve:publish-directory :prefix "/d3" :destination "/misc/reposed/d3/")

(net.aserve:start :port 8888)
