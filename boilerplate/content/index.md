---
title: main page
---

[comment]: <> (Here, the use of `toc` global attribute is demonstrated to render a TOC)
[comment]: <> (Note how the `weight` page attribute is used to order the pages)
# Table Of Contents
{% for section in toc.children -%}
{% if section.children %}
## {{ section.title | capitalize }}
  {% for page in section.children %}

  [{{ page.title }}]({{ page.url }})
  {% endfor %}
{% endif %}
{% endfor %}

## Raw TOC
[comment]: <> (here's a raw view of the full TOC)
{{ toc | dump }}
