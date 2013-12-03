<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <body>
        <style>
          .company{padding:0;margin:0;}
          .bill{width:700px;height:850px;background:#eee;padding:15px;}
          .bill h3{text-align:center;}

          .info{margin-right:0;width:100%;text-align:right;}

          .value{margin:0 10px;padding:0 10px;border-bottom:1px solid black;cursor:default;}
          #tb{width:700px;border:1px solid black;margin-top:10px;background:white;}
          #tb tr td{border:1px solid #bbb;height:50px;width:20%}

          .footer{height:50px;line-height:50px;}

          .approve{width:700px;height:50px;margin-top:10px;background:white;border:1px solid #bbb;}
          .approve span{width:175px;height:50px;line-height:50px;display:inline-block;border-right:1px solid #bbb;}


          #ss{height:48px;width:200px}
        </style>
        <div class='bill'>
        <p class='company'><xsl:value-of select="bill/defaultinfo/company"/></p>
        <h3><xsl:value-of select="bill/defaultinfo/billname"/></h3>
        <div class="info">
          <span class="key">出差人</span>
          <span class="value"><xsl:value-of select="bill/defaultinfo/people"/></span>
          <span class="key">日期</span>
          <span class="value"><xsl:value-of select="bill/defaultinfo/date"/></span>
        </div>
        <table id='tb' cellspacing="0">
          <thead>
            <tr>
              <td>费用科目</td>
              <td>项目</td>
              <td>摘要</td>
              <td>金额</td>
              <td>票据张数</td>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="bill/otherinfo">
              <tr class='row'>
                <td><xsl:value-of select="account" /></td>
                <td><xsl:value-of select="project" /></td>
                <td><xsl:value-of select="summary" /></td>
                <td><xsl:value-of select="amount" /></td>
                <td><xsl:value-of select="piece" /></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
        <div class="footer">
          人民币（大写） 本次报销金额 ￥
        </div>

        <div class="approve">
          <span>请选择审批人</span>
          <select id='ss'>
            <option>郭嘉</option>
            <option>贾诩</option>
            <option>荀攸</option>
            <option>荀彧</option>
            <option>程昱</option>
          </select>
        </div>
      </div>
      <script>
        var values=document.getElementsByClassName('value');
        for(var i in values){
          values[i].onclick=function(){
            var value=prompt("change value:","");
            if(value==""||value==null)
              return;
            this.innerHTML=value;
          }
        }

        var rows=document.getElementsByClassName('row');
        for(var i in rows){
          var cells=rows[i].childNodes;
          for(var j in cells){
            cells[j].onclick=function(){
              this.style.background="orange";
              var value=prompt('change value:',this.innerHTML);
              if(value==""||value==null){
                this.style.background="white";
                return;
              }
              
              this.innerHTML=value;
              this.style.background="white";
            }
          }
        }

      </script>
    </body>
  </html>
  </xsl:template>
</xsl:stylesheet>
