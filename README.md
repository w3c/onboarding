A tool to send a welcome message to newcomers in a group
=======================================================

This tool listens to a W3C webhook and sends emails to new participants in a Working/Interest Group upon joining.

Groups can have a customized welcome message sent automatically, by adding their template to this repository's [`template` directory](https://github.com/w3c/onboarding/tree/master/template), use the group's `type/shortname` as file name (e.g. `wg/css` for the CSS Working Group).

Otherwise the [`default` template](https://github.com/w3c/onboarding/blob/master/template/default) will be used.
Team contacts and chairs will be Cc'd.

__No message is sent to Community/Business Groups new participants by default__, but if the system finds a customized message for a CG/BG, it will be sent and chairs of the CG/BG will be Cc'd.

Templates may use the Twig syntax to include some W3C group data to customize the message.  
Information comes from the [W3C API](https://api.w3.org/doc) (see e.g. https://api.w3.org/groups/wg/css), you can use *name, description, shortname, type* e.g.:

- `{{ group.name }}` will be replaced by the group's name, e.g. "Cascading Style Sheets (CSS) Working Group"
- `{{ group.shortname }}` will be replaced by the group's shortname, e.g. "css"

It is also possible to include links e.g.:

- Group homepage: `{{ group._links.homepage.href }}`, e.g. "https://www.w3.org/Style/CSS/"
- IPR status page: `{{ group._links.pp-status.href }}`, e.g. "https://www.w3.org/groups/wg/css/ipr/"

Of course you may use completely basic URLs without any Twig code at all!
