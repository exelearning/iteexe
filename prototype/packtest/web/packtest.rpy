
from twisted.web.resource import Resource
import page

mypage = registry.getComponent(page.Page)
if not mypage:
   registry.setComponent(page.Page, page.Page())
mypage = registry.getComponent(page.Page)

resource = mypage
