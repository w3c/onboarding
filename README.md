A tool to send the facility map to newcomers in a group
=======================================================

This tool listens to a W3C webhook and sends emails to 
new participants in a Working/Interest Group when they join.

Groups can have a customized welcome message sent automatically, by adding their template to this repository [`template` directory](https://github.com/w3c/onboarding/tree/master/template).  
Use your group's `type/shortname` as file name (e.g. `wg/css` for the CSS Working Group), otherwise the [`default` template](https://github.com/w3c/onboarding/blob/master/template/default) will be used instead.
Team contacts and chairs will be Cc'd.

__No message is sent to Community/Business Groups new participants by default__, but if the system finds a customized message for a CG/BG, it will be sent and chairs of the CG/BG will be Cc'd.

Templates may use the [Twig language](https://twig.symfony.com/) to include some group data to customize your message.  
The syntax is using a double curly bracket and refer to W3C group data.  
Available group information comes from the [W3C API](https://api.w3.org/doc) (see: https://api.w3.org/groups), so you can use *id, name, description, shortname, type, start-date, end-date.* e.g.:

- `{{ group.name }}` will be replaced by your group's name  
e.g. "Cascading Style Sheets (CSS) Working Group"
- `{{ group.id }}` will be replaced by the W3C identifier for your group  
e.g. "32031"

It is also possible to include links e.g.:

- Group homepage: `{{ group._links.homepage.href }}`  
e.g. "https://www.w3.org/Style/CSS/"
- IPR status page: `{{ group._links.pp-status.href }}`  
e.g. "https://www.w3.org/groups/wg/css/ipr/"

Of course you may use completely basic URLs without any Twig code at all!
