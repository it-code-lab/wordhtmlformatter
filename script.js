const allowedTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' ];

const deleteEmptyTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'div',
  'table', 'thead', 'caption', 'tbody', 'pre' ];

const blockSelectTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'p' ];

new Vue({
  el: '#app',
  data () {
    return {
      input: '',
      selectedTag: 'h2',
      tags: blockSelectTags
    }
  },
  methods: {
    handlePaste (e) {
      if (e.clipboardData && e.clipboardData.getData) {
        let inputHtml = e.clipboardData.getData('text/html');
        // If clipboard has html input, 
        // clean it and insert it manually

        //Start of paragraph2
        var text1 = '<div  onmousedown="setLastFocusedDivId(this.id)" class="paragraph2-desc">';
        
        //End of paragraph2
        var text2 = '<button class="deleteDiv" onclick="deleteCurrentComponent(this)"></button></div>';  
     
        //start of Code Script Style3
        var text3 = text2 + '<div  onmousedown="setLastFocusedDivId(this.id)" class="codescript4-desc">';
        //end of Code Script Style3
        var text4 = '<button class="copyDiv" onclick="copyCurrentComponent(this)">Copy</button><button class="deleteDiv" onclick="deleteCurrentComponent(this)"></button></div>' + text1;

        

        if (inputHtml) {
          e.preventDefault();
          e.stopPropagation();
          const bodyRegex = /<body>([\s\S]*)<\/body>/g;
          const matches = bodyRegex.exec(inputHtml);
          const bodyHtml = matches ? matches[1] : inputHtml;
          const textarea = e.target;
          // Get current selection and compute the new value
          const startPos = textarea.selectionStart;
          const endPos = textarea.selectionEnd;

          var newInput = text1 + this.sanitize(bodyHtml) + text2;

          newInput= this.replaceAll(newInput,'<pre><div>', text3 + '<div>');
          newInput = this.replaceAll(newInput, '</div></pre>', '</div></code></pre>' + text4 );

          //newInput= this.replaceAll(newInput,'<pre><div>', text3 + '<pre><div>');
          //newInput = this.replaceAll(newInput, '</div></pre>', '</div></pre>' + text4 );

          //newInput= this.replaceAll(newInput,'<div><code>', '<div>' + text3);
          //newInput = this.replaceAll(newInput, '</code></div>', text4 + '</div>');


          newInput = this.replaceAll(newInput, 'Copy code</div>', '<div class="hideParentDiv"></div>Copy code</div><pre><code>');
          //newInput = this.replaceAll(newInput, 'Copy code</div>', '<div class="hideParentDiv"></div>Copy code</div>');
          //newInput = this.replaceAll(newInput, 'Copy code</button>', 'Copy code</button><div class="hideParentDiv"></div>');
          this.input = newInput;
          navigator.clipboard.writeText(newInput);
          // this.input = textarea.value.substring(0, startPos)
          //   + this.sanitize(bodyHtml)
          //   + textarea.value.substring(endPos, textarea.value.length);
        }
      }
    },
    handleClick (e) {
      // let el = e.target;
      // let newChild = document.createElement(this.selectedTag);
      // var node = document.createTextNode(el.textContent);
      // newChild.appendChild(node);
      // el.parentElement.replaceChild(newChild, el);
      // let newHtml = this.$refs.preview.innerHTML;
      // this.input = this.sanitize(newHtml);
    },
    sanitize (html) {
      let sanitized = sanitizeHtml(html, {
        allowedTags: allowedTags
      });
      sanitized = sanitized
        // <br /><br /> -> </p><p>
        .replace(/<br \/>(\s)*(<br \/>)+/g, '</p><p>')
        // </p><br /> -> </p>
        .replace(/<p \/>(\s)*(<br \/>)+/g, '</p>')
        // <p><br /> -> </p>
        .replace(/<p>(\s)*(<br \/>)+/g, '<p>');
      // delete empty tags
      deleteEmptyTags.forEach(tag => {
        let regex = new RegExp(`<${tag}>(\\s)*</${tag}>`, 'g');
        sanitized = sanitized
          .replace(regex, '');
      })
      
      return sanitized;
    },

    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    },
    replaceAll(str, find, replace) {
      return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }
  }
});

function replaceAllOL(){
  var newInput = document.getElementById("inputArea").value;
  newInput= replaceAll2(newInput,'<ol>', '<ul class = "unordered-list-desc">');
  newInput= replaceAll2(newInput,'</ol>', '</ul>');
  document.getElementById("inputArea").value = newInput;
  navigator.clipboard.writeText(newInput);
}

function escapeRegExp2(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll2(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp2(find), 'g'), replace);
}

// String.prototype.replaceAll = function(search, replacement) {
//   var target = this;
//   return target.replace(new RegExp(search, 'g'), replacement);
// };