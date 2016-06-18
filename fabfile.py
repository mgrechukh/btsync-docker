from fabric.api import env, run, sudo, local, put, parallel, open_shell
from fabric.utils import abort
from fabric.operations import prompt
import datetime

TODAY = datetime.datetime.now().strftime('%Y%m%d%H%M')
NAME = "btsync-mini"

def build_image():
    local("docker build -t %s ." % NAME)

def run_image(preserve=None):
    did=local("docker run -it -d -p 55555:55555 %s" % NAME, capture=True)
    local("docker attach %s" % did)
    if preserve == None and prompt("Remove container?") in ['y', 'yes']:
        local("docker kill %s" % did)
        local("docker rm %s" % did)

def push_image():
    dst_time = "mgrechukh/%s:%s" % (NAME, TODAY)
    dst_latest = "mgrechukh/%s:%s" % (NAME, 'latest')

    local("docker tag -f %s %s" % (NAME, dst_time))
    local("docker push %s" % dst_time)
    local("docker tag -f %s %s" % (NAME, dst_latest))
    local("docker push %s" % dst_latest)
