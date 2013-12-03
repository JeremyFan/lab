<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <body>
        <style>
          .company{padding:0;margin:0;}
          .bill{width:700px;height:450px;background:#eee;padding:15px;}
          .bill h3{text-align:center;}
          .value{margin:0 10px;padding:0 10px;border-bottom:1px solid black;cursor:default;}
          #tb{width:700px;border:1px solid black;margin-top:10px;background:white;}
          #tb tr td{border:1px solid #bbb;height:50px;width:25%}

          .approve{width:700px;height:50px;margin-top:50px;background:white;border:1px solid #bbb;}
          .approve span{width:175px;height:50px;line-height:50px;display:inline-block;border-right:1px solid #bbb;}

          .why{width:99.5%;height:50px;border:none;}

          #ss{height:48px;width:200px}
        </style>
        <div class='bill'>
        <p class='company'><xsl:value-of select="bill/defaultinfo/company"/></p>
        <h3><xsl:value-of select="bill/defaultinfo/billname"/></h3>
        <div>
          <span class="key">出差人</span>
          <span class="value"><xsl:value-of select="bill/defaultinfo/people"/></span>
          <span class="key">出差人部门</span>
          <span class="value"><xsl:value-of select="bill/defaultinfo/dep"/></span>
          <span class="key">日期</span>
          <span class="value"><xsl:value-of select="bill/defaultinfo/date"/></span>
        </div>
        <table id='tb' cellspacing="0">
            <tr>
              <td>预计出差时间</td>
              <td style="text-align:center;">到</td>
              <td>项目</td>
              <td></td>
            </tr>
            <tr>
              <td>地点</td>
              <td></td>
              <td>交通工具特殊申请</td>
              <td></td>
            </tr>
            <tr>
              <td>事由</td>
              <td colspan="3">
                <input class="why" />
              </td>
            </tr>
            <tr>
              <td>借款金额</td>
              <td colspan="3">人民币（大写） ￥</td>
            </tr>
        </table>

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

        var ele_why=document.getElementsByClassName('why');
        ele_why[0].onfocus=function(){
          this.style.outline="2px solid orange";
        }
        ele_why[0].onblur=function(){
          this.style.outline="none";
        }

      </script>
    </body>
  </html>
  </xsl:template>
</xsl:stylesheet>
