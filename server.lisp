(ql:quickload :wuwei)

(net.aserve:publish-directory :prefix "/" :destination "/misc/repos/diabetes-map/")

(net.aserve:start :port 8888)
