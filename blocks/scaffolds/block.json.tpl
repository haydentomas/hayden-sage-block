{
  "apiVersion": 2,
  "name": "smart/{{slug}}",
  "title": "HB – {{title}}",
  "category": "smart-blocks",
  "icon": "layout",
  "description": "{{title}} block.",
  "keywords": ["{{slug}}", "layout", "hayden"],
  "supports": {
    "align": ["wide", "full"],
    "html": false
  },
  "attributes": {
    "heading": { "type": "string", "default": "{{title}}" },
    "text": { "type": "string", "default": "" }
  },
  "editorScript": "hayden-{{slug}}-editor",
  "style": "hayden-{{slug}}-style"
}