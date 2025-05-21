import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class GUI implements ActionListener {

	// Declaring variables
    private JLabel label;
    private JFrame frame;
    private JPanel panel;

    public GUI() {

    	frame = new JFrame();

        // One of the buttons to experiment with
        JButton button = new JButton("Speak with a Person");
        button.addActionListener(this);

		// Question on-screen
        label = new JLabel("Who would you like to speak with?");

		// Graphical layout details
        panel = new JPanel();
        panel.setBorder(BorderFactory.createEmptyBorder(30, 30, 10, 30));
        panel.setLayout(new GridLayout(0, 1));
		panel.add(button);
		panel.add(label);

        frame.add(panel, BorderLayout.CENTER);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setTitle("The Customer Support GUI");
        frame.pack();
        frame.setVisible(true);
    }

	// Main method, create GUI when program runs
    public static void main(String[] args) {
    	new GUI();
    }

	// When the button is clicked, change the text
    @Override
    public void actionPerformed(ActionEvent e) {
        label.setText("Connecting...");
    }

}