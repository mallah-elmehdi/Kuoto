#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main()
{
	int fd;
	char *ok;
	int i;
	FILE *fp;

	i = 1;
	fd = open("../json/type.json", O_RDONLY);
	fp = fopen ("ok.txt","w");
	while (read(fd, ok, 1))
	{
		if (*ok == ':')
		{
			fprintf (fp, "<option value='%d'>", i);
			while (read(fd, ok, 1))
			{
				if (*ok == '\n')
					break;
				if (*ok != '"' && *ok != ' ')
					fprintf (fp, "%c", *ok);
			}
			i++;
			fprintf (fp, "</option>\n");
		}
	}
}
