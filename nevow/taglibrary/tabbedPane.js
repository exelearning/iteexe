function setupTabbedPane(data)
{
    selectedTab = data[0][0];
    
    for(i=0; i<data.length; i++) {
        
        tab = document.getElementById(data[i][0]);
        page = document.getElementById(data[i][1]);
        
        if(tab.id == selectedTab) {
            tab.className = 'selected'
            page.className = 'selected';
        }
        
        tab.onclick = function() {
            
            for(i=0; i<data.length; i++) {
                tab = document.getElementById(data[i][0]);
                page = document.getElementById(data[i][1]);
                
                if(tab.id == this.id) {
                    tab.className = 'selected';
                    page.className = 'selected';
                }
                else {
                    tab.className = '';
                    page.className = '';
                }
            }
        }
    }
}
