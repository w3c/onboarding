
A tool to send the facility map to newcomers in a group
=======================================================

This tool listens to a W3C webhook and sends emails to 
new participants in a Working/Interest Group when they join.

Groups can have a customized welcome message sent automatically, by adding their template to this repository 'template' subdirectory. 
Use your group's id (the same you're using in specs to refer to its patent status) as file name, otherwise the 'default' template will be used instead.
Team contacts and chairs will be Cc'd.

There is no message sent to Community/Business Groups new participants by default, but if the system finds a customized message for a CG/BG, it will be sent 
and chairs of the CG/BG will be Cc'd.

Templates may use the Twig language to include some group data to customize your message.
The syntax is using a double curly bracket and refer to W3C group data, e.g.:

`{{ group.name }}`  will be replaced by your group's name  
`{{ group.id }}`  will be replaced by the W3C identifier for your group

__Of course you may use completely basic URLs without any Twig code at all!__

Available group information comes from the W3C API, so you can use
*id, name, description, shortname, type, start-date, end-date.*
It should also be possible to include links like  
`{{ group._links.homepage.href }}`  
(this will render as `https://www.w3.org/groups/wg/{{ group.shortname }}` )  

or  
`{{ group._links.pp-status.href }}`   
(equivalent to `https://www.w3.org/2004/01/pp-impl/{{ group.id }}/status`)

